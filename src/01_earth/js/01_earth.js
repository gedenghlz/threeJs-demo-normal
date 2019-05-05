function init() {

	var stats = initStats();
	var renderer = initRenderer();
	var camera = initCamera(new THREE.Vector3(0, 20, 40));
	var trackballControls = initTrackballControls(camera, renderer);
	var clock = new THREE.Clock();
  
	var scene = new THREE.Scene();
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
  