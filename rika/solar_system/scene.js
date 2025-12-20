document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 0, 0); // Black background

        // Camera
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.upperRadiusLimit = 50;
        camera.lowerRadiusLimit = 5;
        camera.wheelPrecision = 100;

        // Light
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // Sun
        const sun = BABYLON.MeshBuilder.CreateSphere("sun", { diameter: 2 }, scene);
        const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
        sunMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0); // Yellow emissive color
        sun.material = sunMaterial;

        // Earth
        const earth = BABYLON.MeshBuilder.CreateSphere("earth", { diameter: 1 }, scene);
        const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
        earthMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue diffuse color
        earth.material = earthMaterial;
        earth.position.x = 5; // Distance from the Sun

        // Moon
        const moon = BABYLON.MeshBuilder.CreateSphere("moon", { diameter: 0.4 }, scene);
        const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Grey diffuse color
        moon.material = moonMaterial;
        moon.position.x = 2; // Distance from the Earth

        // Parent the Moon to the Earth
        moon.parent = earth;

        // Animation
        scene.registerBeforeRender(function () {
            // Sun rotation (for visual effect, not physically accurate for a star)
            sun.rotation.y += 0.005;

            // Earth orbits the Sun
            earth.rotation.y += 0.01; // Earth's own rotation
            earth.position.x = 5 * Math.cos(scene.getEngine().getDeltaTime() * 0.0005);
            earth.position.z = 5 * Math.sin(scene.getEngine().getDeltaTime() * 0.0005);

            // Moon orbits the Earth
            moon.rotation.y += 0.02; // Moon's own rotation
            moon.position.x = 2 * Math.cos(scene.getEngine().getDeltaTime() * 0.002);
            moon.position.z = 2 * Math.sin(scene.getEngine().getDeltaTime() * 0.002);
        });

        return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
});
