'use strict';

(function () {
  // Password Validator Directive Spec
  describe('DonorpinFormComponent', function () {
    // Initialize global variables
    var scope,
      element,
      $compile,
      donorpinFormService,
      donorPinReference,
      $httpBackend,
      form;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function (_$rootScope_, _$compile_, _DonorpinsService_, _$httpBackend_) {
      // Set a new global scope
      scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      donorpinFormService = _DonorpinsService_;
      donorPinReference = new _DonorpinsService_();

      var donorpinCreateScope = {};
      var addDonorPinCallBack = function (cb) {
        return true;
      };
      donorpinCreateScope.donorpinFormService = donorPinReference;
      donorpinCreateScope.newDonorPinLongitude = -82.4450672219958;
      donorpinCreateScope.newDonorPinLatitude = 35.6142827603496;
      donorpinCreateScope.newDonorPinX = -9177742.90156979;
      donorpinCreateScope.newDonorPinY = 4247676.25019894;
      donorpinCreateScope.callbackFunction = addDonorPinCallBack;
      scope.$ctrl = donorpinCreateScope;
    }));

    function compileDirective(template) {
      // function to compile a fresh directive with the given template, or a default one
      // input form with directive
      if (!template) {
        template = '<donor-pin-form-popup ' +
          'donorpin="$ctrl.donorpinFormService" ' +
          'longitude="$ctrl.newDonorPinLongitude" ' +
          'latitude="$ctrl.newDonorPinLatitude" ' +
          'x="$ctrl.newDonorPinX" ' +
          'y="$ctrl.newDonorPinY" ' +
          'callback="$ctrl.callbackFunction"></donor-pin-form-popup>';
      }


      // inject allows you to use AngularJS dependency injection
      // to retrieve and use other services
      inject(function ($compile) {
        var form = $compile(template)(scope);
        // $digest is necessary to finalize the directive generation
        scope.$digest();
        element = form.find('#donorpin-create-form');
        scope.form = element;
        scope.popup = form;
      });
    }

    describe('Initialize', function () {
      beforeEach(function () {
        compileDirective();
      });

      it('should produce the firstname input', function () {
        expect(element.find('#firstname').length).toEqual(1);
      });

      it('should check form validity upon initializing', function () {
        expect(scope.form.$valid).toBeFalsy();
      });

      // it('should check form validity upon initializing', function () {
      //   donorPinReference.firstname = 'Mateusz';
      //   donorPinReference.lastname = 'Grzesiukiewicz';
      //   donorPinReference.contactnumber = '+001112222332';
      //   donorPinReference.emailaddress = 'ajdija@gmail.com';
      //   donorPinReference.bloodgroup = 'A';
      //   compileDirective();
      //   scope.$digest();
      //   // Test expected GET request
      //   $httpBackend.when('POST', 'api/donorpins').respond(200,
      //     {"_id":"57fece1d1ea19c55dc11d808","longitude":-82.439,"latitude":35.611,"x":-9177025.110101026,"y":4247252.263557663,"firstname":"Mateusz","lastname":"Grzesiukiewicz","contactnumber":"+001112222333","bloodgroup":"AB","__v":0,"created":"2016-10-12T23:58:21.136Z","emailaddress":"ajdija@gmail.com"});
      //   //   Further need to mock Socket.io using sinon
      //
      //   socket = {
      //     emit : sinon.spy(),
      //     on : sinon.spy()
      //   };
      // });
    });
  });
}());
