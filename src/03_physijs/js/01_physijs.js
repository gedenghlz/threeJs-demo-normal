function init() {
	//以下两个属性分别指向要执行的任务线程和ammo.js库
	Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
	Physijs.scripts.ammo = './ammo.js';

	var stats = initStats();
	var renderer = initRenderer({
		antialias: true
	});
	var camera = initCamera(new THREE.Vector3(0, 0, 100));
	var trackballControls = initTrackballControls(camera, renderer);
	var clock = new THREE.Clock();
	var gui = new dat.GUI();
	var controls = {};

	//创建带有物理效果的场景
	var scene = new Physijs.Scene();
	//setGravity()函数设置重力大小为y轴负方向，大小为10
	scene.setGravity(new THREE.Vector3(0, -20, 0));
	initDefaultLighting(scene);
	scene.add(new THREE.AmbientLight(0x444444));

	//原场景
	var sphere = new THREE.SphereGeometry(5, 20, 20)
	var sphereMesh = addGeometry(scene, sphere, 'sphere', null, gui, controls);
	sphereMesh.position.x = 20;
	var textureLoader = new THREE.TextureLoader();
	var sphere = new THREE.PlaneGeometry(100, 100)

	// var sphereMesh = addGeometry(scene, sphere, 'sphere', textureLoader.load('../../assets/textures/general/floor-wood.jpg'), gui, controls);
	var material0 = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
		map: textureLoader.load('../../assets/textures/general/floor-wood.jpg')
	}))
	var Mesh0 = new Physijs.BoxMesh(sphere, material0, 0)//第三个参数：1：可以正常运动 0：固定（类似墙体）默认值：1
	Mesh0.rotation.x = -Math.PI / 2.2
	Mesh0.position.y = -20
	scene.add(Mesh0)

	//物理场景
	var geometry = new THREE.CubeGeometry(10, 10, 10);
	var material = new Physijs.createMaterial(new THREE.MeshPhongMaterial({

	}),
		1,//摩擦系数  
		2 //弹性形变
	)

	var pMesh = new Physijs.ConvexMesh(geometry, material, 1)//第三个参数：1：可以正常运动 0：固定（类似墙体）默认值：1
	pMesh.position.x = -20;
	pMesh.position.y = 20;


	scene.add(pMesh);

	//渲染物理场景

	render();
	function render() {
		stats.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		scene.simulate();//调用物理引擎
		trackballControls.update(clock.getDelta());
	}



}