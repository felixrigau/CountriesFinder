var app = {
  countryManagement:{
    all: function () {
      app.tools.makeRequest('GET', 'https://restcountries.eu/rest/v2/all', true, app.renderView.fillCountries);
    },
    details: function (code) {
      app.tools.makeRequest('GET', 'https://restcountries.eu/rest/v2/alpha/'+code, true, app.renderView.fillCountryDetails);
    }
  },

  renderView:{
    fillCountries: function (json) {
      if(json){
        var countriesCombo = document.querySelector('.countries');
        for (var i = 0; i < json.length; i++) {
          countriesCombo.innerHTML += '<option class=\'item\' value=\"'+json[i].alpha2Code+'\">'+json[i].name+'</option>';
        }
        app.events.setOnChangeEvent();
      }
    },

    fillCountryDetails:function (json) {
      if (json) {
        var flag = document.querySelector('.flag');
        var name = document.querySelector('.name');
        var population = document.querySelector('.population');

        flag.src = json.flag;
        name.innerText = json.name;
        population.innerText = json.population;

        initMap(json.name);
      }
    },

    test:function (json) {
      if (json) {
        var container = document.querySelector('.general-container');
        container.innerHTML = '<h1>THERE IS A JSON!!!, JSON.length = '+json.length+'</h1>';
        console.table(json);
      }
    }
  },

  events:{
    setOnChangeEvent:function () {
      var selectItems = document.querySelectorAll('.countries');
      for (var i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener('change',function () {
          if(event.target.value){
            codeCountry = event.target.value;
            app.countryManagement.details(codeCountry);
          }
        }, false);
      }
    }
  },

  tools:{
    makeRequest: function (httpMethod, url, asynchronous, callback) {
      var request = new XMLHttpRequest();
      request.open(httpMethod,url, asynchronous);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200 && request.responseText ) {
            var json = JSON.parse(request.responseText);
            callback(json);
            return true;
        }else{
            return false;
        }
      };
      request.send(null);
    },

    test: function () {
      app.tools.makeRequest('GET','https://restcountries.eu/rest/v2/all',true,app.tools.callbackTest);
    },

    callbackTest:function (json) {
      if (json) {
        console.log('THERE IS JSON!!!');
      }
    }
  }
};

var map;
function initMap(name) {
  var map = new google.maps.Map(document.getElementById('map'), {zoom: 17});
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'address': name}, function(results, status) {
    if (status === 'OK') {
      console.log(results);
      map.setCenter(results[0].geometry.location);
      map.fitBounds(results[0].geometry.bounds  );

    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  });
}
