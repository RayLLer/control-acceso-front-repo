'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "055c2832bc9d3f7ce190cf0199fa273f",
"assets/AssetManifest.bin.json": "07690004bd9951a4c2e44e11e870a576",
"assets/AssetManifest.json": "cb951df8daa835ee293f6e22302f720f",
"assets/assets/fonts/montserrat/Montserrat-Black.ttf": "cce7ff8c1d7999f907b6760fbe75d99d",
"assets/assets/fonts/montserrat/Montserrat-Bold.ttf": "ed86af2ed5bbaf879e9f2ec2e2eac929",
"assets/assets/fonts/montserrat/Montserrat-ExtraBold.ttf": "9e07cac927a9b4d955e2138bf6136d6a",
"assets/assets/fonts/montserrat/Montserrat-ExtraLight.ttf": "a7fe50578d9aa3966c925cb9722db03a",
"assets/assets/fonts/montserrat/Montserrat-Light.ttf": "94fbe93542f684134cad1d775947ca92",
"assets/assets/fonts/montserrat/Montserrat-Medium.ttf": "bdb7ba651b7bdcda6ce527b3b6705334",
"assets/assets/fonts/montserrat/Montserrat-Regular.ttf": "5e077c15f6e1d334dd4e9be62b28ac75",
"assets/assets/fonts/montserrat/Montserrat-SemiBold.ttf": "cc10461cb5e0a6f2621c7179f4d6de17",
"assets/assets/fonts/montserrat/Montserrat-Thin.ttf": "b3638b16904211d1d24d04ce53810c4d",
"assets/assets/icons/CustomIcons.ttf": "6b55f21811a844e219efaa6cc6547670",
"assets/assets/images/base_vector.svg": "bfbd5da6d7286c312963e1426bd86b3d",
"assets/assets/images/basic_plan.png": "23f31ad3d22116b5e41f17f9efcd28e8",
"assets/assets/images/book.svg": "2b16da66a51d852ab009bc5217b4f225",
"assets/assets/images/cloud_image.svg": "9fc0197dfd09913e14eecff1fd115554",
"assets/assets/images/computing_plan.png": "48709ebcb1b75709000b2173898870e9",
"assets/assets/images/discard_help.svg": "d8864f90a5db2cc8a57cfea29f7a0ddd",
"assets/assets/images/excel.png": "3678a97a970bf0e563f493080c9602ca",
"assets/assets/images/globe.svg": "5ff51176b1c354257d368f52482c57b1",
"assets/assets/images/goal_flag.svg": "8a729a82cdf4b5aa4cb6b75127caa465",
"assets/assets/images/half.svg": "f4caa313402e6d4dea907a12b64b4384",
"assets/assets/images/half_help.svg": "1347ee9f4d42eb5f8f5738fed9965e94",
"assets/assets/images/home_page_logo.svg": "8409729952b16c56fb739c5c8122f2d9",
"assets/assets/images/info_conversation.svg": "d9f19432425dc019ec16d93c6d5fb5b3",
"assets/assets/images/launcher_icon.png": "b4f7c713ce3b0ab16884a38055757d2e",
"assets/assets/images/option_1.png": "e3225a575f22c5f9c675d8f7f4b9022c",
"assets/assets/images/option_1_.png": "2a493c3930efc7d7edd8275c6050ead5",
"assets/assets/images/option_2.png": "663f27e46b60bedbb28917ce14f95fd5",
"assets/assets/images/option_2_.png": "469bb961dcc9b0d2cd4dad2e062be170",
"assets/assets/images/option_3.png": "34b18bccfbdf963bbe1b712135fbe6ce",
"assets/assets/images/option_3_.png": "65a03e35848b3e2b799fa439b4bc328c",
"assets/assets/images/option_4.png": "bb1d1a76e3e041199dd0d02a6bec3df6",
"assets/assets/images/option_4_.png": "c40c0433f68a9e4e3d97320af08e9290",
"assets/assets/images/option_5.png": "554ea088965695f34371d32a7db347b9",
"assets/assets/images/option_5_.png": "6e358b50820ba5cad4c371536e74b57b",
"assets/assets/images/option_6.png": "eb0dcaf0667c19d6faea032fd60f82ec",
"assets/assets/images/option_6_.png": "bd3a228a32febc3da4b77e01a58da465",
"assets/assets/images/option_7.png": "fac7a69e4179c6dbc207777bdf9bd85a",
"assets/assets/images/option_7_.png": "ed829fe5a3a8501a91d9a037118fefa4",
"assets/assets/images/option_8.png": "ab6c32600b440fcf044f95bdb7c75cc2",
"assets/assets/images/option_8_.png": "b51c0506296812189054b2efbb5a0cbf",
"assets/assets/images/option_9.png": "e2f8758457a03093e134211bd49da241",
"assets/assets/images/option_9_.png": "a68fdf3996392ec191f4e27943f9d9c3",
"assets/assets/images/paused.svg": "ebbbeeeb1bb0971a024a26eeb2b4be05",
"assets/assets/images/play_it_1.svg": "5d77eba9fdfba70ab9ccc96cccf92637",
"assets/assets/images/play_it_2.svg": "23d77d0008cc2020e6ea4f0e9a7e7f64",
"assets/assets/images/play_it_help.svg": "88c0a9f029708351cd6aee298d4fde3c",
"assets/assets/images/progress_flag.svg": "a0b4c42d46d2b3b0a9cde6816e7a4c40",
"assets/assets/images/progress_person.svg": "617d000dd6e594c0eb24674523c44b81",
"assets/assets/images/promotion.png": "284cff7bbf83ccf6a26b3db5348d94f7",
"assets/assets/images/pro_plan.png": "d20f40a45b0a7f95ea5a1a7cc2323bcb",
"assets/assets/images/pro_plan_logo.png": "2bd4ece1325d86060347a7c1c3cda2ca",
"assets/assets/images/pro_plan_logo@2.png": "bed923b727728a1c1eaba67fa2e864f5",
"assets/assets/images/statistic_page_logo.svg": "87c2153c54009bd505b467eca33293c1",
"assets/assets/images/stripe_safe.png": "658519a7d52074595ec695947ff70944",
"assets/assets/images/third_exercise.png": "ef53f05a20c7589430ff606c16bd1446",
"assets/assets/images/throwaway.svg": "5e2c28bc560454f20ff6a3d3ed996e99",
"assets/assets/images/upgrade_plan.svg": "f8707a06204a6dca21737593fde9b9f4",
"assets/assets/images/user_placeholder.png": "e218856652653eab373652190b76f598",
"assets/assets/images/user_placeholder.svg": "2a5b078f4e5df3cb06d21862adb3cb11",
"assets/assets/images/welcome_page_logo.svg": "970679f8179e2c100229dc25027b8312",
"assets/assets/images/welcome_test_image.png": "a297478f40cdafbbca8072cbc8c4bb4e",
"assets/assets/images/welcome_test_image_web.png": "b4e2a88856a3543b724911c2316cd100",
"assets/FontManifest.json": "00375e0cac4b7b48654fe8f0f801aee0",
"assets/fonts/MaterialIcons-Regular.otf": "1ad4ed39a6355ac1d3c9e106855b61bf",
"assets/NOTICES": "6f48dc2521557bcd9c6c9a760d4c62be",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "28dc2bae4d155f06c79885b3cbc6239c",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"cookies.js": "d0bfac7943cc663662695c20c15b3ed9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"flutter_bootstrap.js": "da9798ae28176b7ba8feb73f1c872708",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "e83adfcba1f4c16ea8d6dcb12d767ceb",
"/": "e83adfcba1f4c16ea8d6dcb12d767ceb",
"main.dart.js": "42b85b8b2942d9e0732768c77019a700",
"manifest.json": "34d7a93a24a9edfdcbc76b9763f73a11",
"version.json": "9ee164a6bd422f9925278a3506518797"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
