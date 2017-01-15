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
        generatePalette: function(name,image,logo){
        console.log(name,image,logo);
        },
        imageReader: function(image) {
          console.log('image is here', image);
        //   console.log('hi! step 1' + image);
        //   var reader = new FileReader();
        //   var image1 = reader.readAsDataURL(image);
        //   console.log(image1);
        //   console.log('oh what the f');

        },
        postPalette: function(name,logo) {
          console.log(name);
          console.log('step 1');
          var self = this;
          var colorThief = new ColorThief();
          var $http = prism.$injector.get('$http');
          var image = document.getElementById('paletteFile').files[0];
          if (image === null || image === undefined || name === undefined) {
            if (name === undefined || name === null) {
              console.log('no name');
              document.getElementById('noName').className = 'noImage';
              setTimeout(function(){
                document.getElementById('noName').className = 'invisible';},2000);
          }
            console.log('no image');
            document.getElementById('noImageError').className = 'noImage';
            setTimeout(function(){
              document.getElementById('noImageError').className = 'invisible';},2000);


          } else {
            var reader  = new FileReader();
            reader.onload = function(e) {
              var img = document.createElement('img');
              img.src = e.target.result;
              console.log('hi!!!');
              var colorsArray = colorThief.getPalette(img,8);
              console.log('here I am ');
              var hexColors = colorsArray.map(function(x){
                var newColor = new Color(x[0],x[1],x[2]);
                return newColor.toHex();});
              console.log(hexColors, 'name - ',name);
              var paletteObj = {'name': name, 'colors': hexColors,  'isDefault': true, 'sortOrder': 0};
              console.log('object - ', paletteObj);

              $http({
                method: 'POST',
                url: 'http://localhost:8081/api/palettes',
                data: paletteObj
              }).then(function successCallback(response) {
                console.log('cool!',response);
              }, function errorCallback(response) {
                console.log('oupss',response);
              });

              $widnowStack.closeAllWindowsAbove();

            };
            reader.readAsDataURL(image);
            // console.log('DATA TYPE ',typeof image);
            // $http({
            //   method: 'POST',
            //   url: 'http://localhost:8081/api/palettes',
            //   data: paletteObj
            // }).then(function successCallback(response) {
            //   console.log('cool!',response);
            // }, function errorCallback(response) {
            //   console.log('oupss',response);
            // });
            console.log('dean1');
            console.log('dean2');

            if (logo==true) {
              console.log(logo);

              console.log(image);

              // var brandingObj = {logo: {desktop: {small: image}}};
              // $http({
              //   method: 'POST',
              //   url: 'http://localhost:8081/api/branding',
              //   // headers: {'Content-Type': undefined,},
              //   data: brandingObj
              // }).then(function successCallback(response) {
              //   console.log('logo cool!',response);
              // }, function errorCallback(response) {
              //   console.log('logo oupss',response);
              // });
            }

          }

        }
      },
      templateUrl: '/plugins/paletteOfficial/popupHtml.html?what',
    });
    console.log('execute');
  },
  title: 'Palette By Image!',
  tooltip: 'Create a palette by image colors',
};

console.log('hi!');

prism.on('beforemenu',function (event, args) {
  if (args.settings.name == 'dashboard') {
    console.log(args.settings.items);
    args.settings.items.push(paletteButton);
    console.log('orel');
  }

});
