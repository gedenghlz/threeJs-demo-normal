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

	//这里要注意点和地球要组成一个组
	var group = new THREE.Object3D;
	var sphere = new THREE.SphereGeometry(16, 40, 40,Math.PI/2);//多面几何体
	var sphere = addGeometry(group, sphere, 'sphere', textureLoader.load('../../assets/textures/earth/Earth.png'), gui, controls);

	function getPos(v) {
		var theta = (v.lng + 180) * (Math.PI / 180),
			phi = (90 - v.lat) * (Math.PI / 180),
			radius = v.r;
		return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta));
	}

	//用fetch来读取csv很方便
	fetch("airport.csv").then(v => v.text())
		.then(data => {
			splitdate = data.split(/\s+/);

			var material = new THREE.PointsMaterial({
				color: 0x0ff0cc,
				size: 0.2

			})
			//区分points和sprite
			//points:Geometry中放入多个顶点，THREE.Points会将每一个顶点添加材质，比每个点生层一个几何体性能更好
			//sprite:Sprite是一个永远面向相机的平面，通常用来加载纹理，并且，sprite不接受阴影,用sprite来格式化外部图片粒子，会显得轻而易举
			var pointGeom = new THREE.Geometry();

			for (var i = 0; i < splitdate.length; i++) {
				var data = splitdate[i].split(",");
				if (i != 0 && data[3]) {
					//此处一定要注意使用parseFloat，否则经纬度会不准确
					pointGeom.vertices.push(getPos({
						lng: parseFloat(data[3]),
						lat:parseFloat(data[2]) ,
						r: 16
					}))
				}
			}
			var points = new THREE.Points(pointGeom, material);
			group.add(points);
			scene.add(group);
		})
	render();
	function render() {
		stats.update();
		trackballControls.update(clock.getDelta());
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		group.rotation.y += 0.005
	}
}
