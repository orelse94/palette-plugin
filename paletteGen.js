angular.module('app', ['ng-file-model']);

var $dom = prism.$injector.get('ux-controls.services.$dom');



var paletteButton = {
  id: 'palette',
  caption: 'Palette By Image',
  desc: 'oh this is so cool',
  execute: function () {
    $dom.modal({
      scope:{

        imgWatcher: function(filush,imgUrl) {
          // console.log(filush);
          // console.log(imgUrl);
          console.log('change!!');
          var image = document.getElementById('paletteFile').files[0];
          var img = document.createElement('img');
          var colorThief = new ColorThief();
          var imgCycleW = function (src) {
            img.onload = function() {
              var colorsArray = colorThief.getPalette(img,8);

              var hexColors = colorsArray.map(function(x){
                var newColor = new Color(x[0],x[1],x[2]);

                return newColor.toHex();});

              hexColors.forEach(function(hex) {
                console.log('color');
                var bla = document.getElementById('colorsPreview');
                var viewHex = document.createElement('div');
                // hex.style.backgroundColor = hex;
                bla.appendChild(viewHex);
                viewHex.style.backgroundColor = hex;
                viewHex.style.width = '30px';
                viewHex.style.height = '30px';
                viewHex.style.display = 'inline-block';
                viewHex.style.border = '1px solid white';


              });
            };
            img.src = src;

          };


          if (!imgUrl) {
            var reader  = new FileReader();
            reader.onload = function(e) {
              imgCycleW(e.target.result);
            };

              reader.readAsDataURL(image);
          } else {
            imgCycleW(imgUrl);
          }


        },
        postPalette: function(name,imgUrl) {

          var colorThief = new ColorThief();
          var $http = prism.$injector.get('$http');
          var image = document.getElementById('paletteFile').files[0];
          if (!name || (!imgUrl && !image)) {
            if (!name ) {
              document.getElementById('noName').className = 'noImage';
              setTimeout(function(){
                document.getElementById('noName').className = 'invisible';},2000);
            } else {
            document.getElementById('noImageError').className = 'noImage';
            setTimeout(function(){
              document.getElementById('noImageError').className = 'invisible';},2000);
            }

          } else {
            var imgCycle = function (src) {
              var img = document.createElement('img');
              img.onload = function() {

                var colorsArray = colorThief.getPalette(img,8);

                var hexColors = colorsArray.map(function(x){
                  var newColor = new Color(x[0],x[1],x[2]);

                  return newColor.toHex();});

                // hexColors.forEach(function(hex) {
                //   console.log("color");
                //   var viewHex = document.createElement(hex);
                //   // hex.style.backgroundColor = hex;
                //   document.body.appendChild(viewHex);
                //   hex.style.backgroundColor = hex;
                // });
                var paletteObj = {'name': name, 'colors': hexColors,  'isDefault': true, 'sortOrder': 0};


                $http({
                  method: 'POST',
                  url: 'http://localhost:8081/api/palettes',
                  data: paletteObj
                }).then(function successCallback(response) {
                  return response;
                }, function errorCallback(response) {
                  return response;
                });
                var dashId = prism.activeDashboard.oid;
                var updateDashPalette = {'style' : {'name' : name, 'palette' : {'colors' : hexColors}}};

                $http({
                  method: 'PATCH',
                  url: 'http://localhost:8081/api/v1/dashboards/'+dashId,
                  data: updateDashPalette
                }).then(function successCallback(response) {
                  window.location.reload();
                  return response;
                }, function errorCallback(response) {
                  return response;
                });



              };
              img.src = src;

            };


            if (imgUrl) {
              imgCycle(imgUrl);
            } else {

            var reader  = new FileReader();
            reader.onload = function(e) {
              imgCycle(e.target.result);

            };

              reader.readAsDataURL(image);
          }

          }

          },

      },
      templateUrl: '/plugins/paletteOfficial/popupHtml.html',
    });
  },
  title: 'Palette By Image!',
  tooltip: 'Create a palette by image colors',
};

prism.on('beforemenu',function (event, args) {
  if (args.settings.name == 'dashboard') {
    args.settings.items.push(paletteButton);
  }

});
