function init() {
	//以下两个属性分别指向要执行的任务线程和ammo.js库
	Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
	Physijs.scripts.ammo = './ammo.js';

	var stats = initStats();
	var renderer = initRenderer();
	var camera = initCamera(new THREE.Vector3(-10, 10, 40));
	var trackballControls = initTrackballControls(camera, renderer);
	var clock = new THREE.Clock();


	//创建带有物理效果的场景
	var scene = new Physijs.Scene({
		reportSize: 10, fixedTimeStep: 1 / 60
	});
	//setGravity()函数设置重力大小为y轴负方向，大小为10
	scene.setGravity(new THREE.Vector3(0, -10, 0));
	initDefaultLighting(scene);
	scene.add(new THREE.AmbientLight(0x444444));



	var gui = new dat.GUI();
	var controls = {};

	var beamGeometry = new THREE.BoxGeometry(1, 1, 100);
	var beamMesh = new Physijs.BoxMesh(beamGeometry, new Physijs.createMaterial(new THREE.MeshPhongMaterial({
		color: 0xcccccc
	}),
		0,//摩擦系数  
		2 //弹性形变
	),0)
	beamMesh.receiveShadow = true;
	beamMesh.position.y = -6;
	scene.add(beamMesh);

	generateBead()
	function generateBead() {
		var colors = chroma.scale(['#fff', 'hotpink'])
		var beads = [];

		for (var i = 0; i < 40; i++) {
			var bead = new THREE.SphereGeometry(0.5);
			var phyBead = new Physijs.SphereMesh(bead, new Physijs.createMaterial(new THREE.MeshStandardMaterial({
				color: colors(Math.random()).hex()
			}, 0, 4)),1)
			phyBead.position.set(-20+i*0.9,5,Math.random()/2);
			phyBead.castShadow = true;
			scene.add(phyBead);
			beads.push(phyBead);
			if(i!=0){
				// 点约束
				// 如果添加了一个对象，那这个对象会随着指定的点产生类似大摆锤的效果，超出不了被添加时距离点的距离。 
				// 如果添加了两个对象，那这两个对象的距离超出不了添加场景时的两个物体的距离。
				var breadConstraint = new Physijs.PointConstraint(
					beads[i-1],// 第一个被约束的对象
					phyBead,//限制第一个对象的物体，可以忽略，如果被忽略，第一个对象将被限制到点上
					phyBead.position //被限制到的点的位置
					);
				scene.addConstraint(breadConstraint)
			}
		}
	}

	render();
	function render() {
		stats.update();
		trackballControls.update(clock.getDelta());
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		scene.simulate();//调用物理引擎
		trackballControls.update(clock.getDelta());

	}
}