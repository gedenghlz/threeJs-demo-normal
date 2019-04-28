function init() {

	// use the defaults
	var stats = initStats();
	var renderer = initRenderer();
	var camera = initCamera(new THREE.Vector3(0, 20, 40));
	var trackballControls = initTrackballControls(camera, renderer);
	var clock = new THREE.Clock();
  
	// create a scene, that will hold all our elements such as objects, cameras and lights.
	// and add some simple default lights
	var scene = new THREE.Scene();
	// var groundPlane = addLargeGroundPlane(scene,true)
	// groundPlane.position.y = -10;
	initDefaultLighting(scene);
	scene.add(new THREE.AmbientLight(0x444444));
  
	var textureLoader = new THREE.TextureLoader();
	var gui = new dat.GUI();
	var controls = {};
	var sphere = new THREE.SphereGeometry(16, 100,100);//多面几何体
	var sphere = addGeometry(scene, sphere, 'sphere', textureLoader.load('../../assets/textures/earth/Earth.png'), gui, controls);

  
	render();
	function render() {
	  stats.update();
	  trackballControls.update(clock.getDelta());
	  requestAnimationFrame(render);
	  renderer.render(scene, camera);
	  sphere.rotation.y +=0.001
	}
  }
  