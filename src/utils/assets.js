(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.assets;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    // creates a promise for an image element from a url
	const loadImage = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create an image object
			const resource = new Image();

			// set it to fulfill the promise once loaded
			resource.onload = () => {
				fulfill(resource);
			};

			// start loading the url
			// this happens after setting the handler in case the image loads immediately
			resource.src = url;
		});
	};

	namespace.loadImage = loadImage;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for an audio media element from a url
	const loadAudioMedia = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create an audio object
			const resource = new Audio();

			// set it to fulfill the promise once loaded
			resource.oncanplay = () => {
				fulfill(resource);
			};

			// start loading the url
			// this happens after setting the handler in case the udio loads immediately
			resource.src = url;
		});
	};

	namespace.loadAudioMedia = loadAudioMedia;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a singleton web audio context
	const webAudioContext = () => {
		// create the singleton, if it doesn't exist
		if (webAudioContext.singleton === undefined) {
			webAudioContext.singleton = (
				window.AudioContext !== undefined ? new window.AudioContext() :
				window.WebkitAudioContext !== undefined ? new window.WebkitAudioContext() : null
			)
		}

		return webAudioContext.singleton;
	};

	// creates a promise for an audio buffer from a url
	const loadAudioBuffer = (url) => {
		// defer loading to load audio media if web audio is not implemented
		if (webAudioContext() === null) {
			return ;
		}

		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = () => {
				webAudioContext().decodeAudioData(request.response, (buffer) => {
					if (!buffer) {
						reject(new Error('Error decoding file data: ' + url));

						return;
					}

					fulfill(buffer);
				}, (error) => {
					reject(error);
				});
			};

			request.onerror = () => {
				reject('Audio failed to load.');
			};

			request.send();
		});
	};

	namespace.loadAudioBuffer = loadAudioBuffer;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for json data
	const loadJSON = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create object
			const httpRequest = new XMLHttpRequest();

			// load
			httpRequest.onreadystatechange = () => {
				if (httpRequest.readyState === 4 && httpRequest.status === 200) {
					fulfill(JSON.parse(self.responseText));
				}
			};

			httpRequest.open('GET', url);
			httpRequest.send();
		});
	};

	namespace.loadJSON = loadJSON;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for an external script
	const loadScript = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create object
			const resource = document.createElement('script');

			// load
			resource.onload = resource.onreadystatechange = () => {
				if (!self.readyState || self.readyState == 'compconste') {
					fulfill(resource);
				}
			};

			resource.src = url;

			// add to head
			document.getElementsByTagName('head')[0].appendChild(resource);
		});
	};

	namespace.loadScript = loadScript;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// maps file extensions to the appropriate loader to use for that extension
	const extensions = {
		jpg : loadImage,
		png : loadImage,
		bmp : loadImage,

		mp3 : loadAudioMedia,
		ogg : loadAudioMedia,
		wav : loadAudioMedia,

		json : loadJSON,

		js : loadScript
	};

	// a general loader that loads things based on file extensions
	const load = (url) => {
		// figure out the file extension
		const extension = url.match(/(?:\.([^.]+))?$/)[1];

		// dynamically choose which asset loader to use based on the file extension
		const loader = extensions[extension];

		// load the url if the loader for that extention exists
		// otherwise, return a rejected promise with an error message
		return loader !== undefined ? loader(url) : Promise.reject(Error('Unknown extension "' + extension + '".'));
	};

	namespace.load = load;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// entries creates a list of key value pairs from an object
	const entries = (object) => {
        const result = [];

        for (let key of Object.keys(object)) {
            result.push([key, object[key]]);
        }

		return result;
	};

	// loads a set of named assets
	const loadAll = (assetMap) => {
		// this will store all of the assets once they've loaded
		const loadedAssets = {};

		// map each entry into a promise using the general loader
		// make the URL's relative to the base URL
		// create a promise that waits for each asset to load
		return Promise.all(entries(assetMap).map(([name, url]) => load(url).then((asset) => {
			// attach the asset to the set of loaded assets
			loadedAssets[name] = asset;
		}))).then(() => {
			return loadedAssets;
		});
	};

	namespace.loadAll = loadAll;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
