angular.module('app', ['ng-file-model']);

var $dom = prism.$injector.get('ux-controls.services.$dom');
var $widnowStack = prism.$injector.get('ux-controls.services.$windowStack');


var paletteButton = {
  id: 'palette',
  caption: 'Palette By Image',
  desc: 'oh this is so cool',
  execute: function () {
    $dom.modal({
      scope:{
        postPalette: function(name) {
          var colorThief = new ColorThief();
          var $http = prism.$injector.get('$http');
          var image = document.getElementById('paletteFile').files[0];
          if (image === null || image === undefined || name === undefined) {
            if (name === undefined || name === null) {
              document.getElementById('noName').className = 'noImage';
              setTimeout(function(){
                document.getElementById('noName').className = 'invisible';},2000);
          } else if (image === null || image === undefined) {
            document.getElementById('noImageError').className = 'noImage';
            setTimeout(function(){
              document.getElementById('noImageError').className = 'invisible';},2000);
          }

          } else {
            var reader  = new FileReader();
            reader.onload = function(e) {
              var img = document.createElement('img');
              img.src = e.target.result;
              var colorsArray = colorThief.getPalette(img,8);
              var hexColors = colorsArray.map(function(x){
                var newColor = new Color(x[0],x[1],x[2]);
                return newColor.toHex();});
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

              $widnowStack.closeAllWindowsAbove();

            };
            reader.readAsDataURL(image);

          }

        }
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
