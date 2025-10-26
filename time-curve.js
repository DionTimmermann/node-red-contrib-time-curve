const secondsPerDay = 24 * 60 * 60;

module.exports = function(RED) {
    function timeCurve(config) {
        RED.nodes.createNode(this, config);

        const iterableAssignment = function(obj, keys, value){
            if(keys.length == 1){
                obj[keys[0]] = value;
            }
            else if(keys.length > 1){
                const thisKey = keys[0];
                keys.splice(0,1);
                if(!obj[thisKey])
                    obj[thisKey] = {};
                iterableAssignment(obj[thisKey], keys, value);
            }
        }

        // Clone and extend points cyclically
        this.points = [
            { x: config.points[config.points.length - 1].x - secondsPerDay, y: config.points[config.points.length - 1].y },
            ...config.points,
            { x: config.points[0].x + secondsPerDay, y: config.points[0].y }
        ];

        var node = this;
        node.on('input', function(msg){
            const input_key  = (config.input_key)?config.input_key:"payload";
            const output_key = (config.output_key)?config.output_key:"payload";
            const inputKeys  = input_key.split(".");
            const outputKeys = output_key.split(".");

            let inputValue = msg;
            for( i=0; i < inputKeys.length; i++ ){
                inputValue = inputValue[inputKeys[i]];
            }

            const date = new Date(inputValue);
            const seconds = (
                date.getHours() * 3600 +
                date.getMinutes() * 60 +
                date.getSeconds() +
                date.getMilliseconds() / 1000
            );

            // Find segment [p0, p1] such that p0.x <= seconds < p1.x
            let p0, p1;
            for (let i = 0; i < node.points.length - 1; i++) {
                if (seconds >= node.points[i].x && seconds < node.points[i + 1].x) {
                    p0 = node.points[i];
                    p1 = node.points[i + 1];
                    break;
                }
            }

            // Handle edge case (seconds exactly at the end)
            if (!p0) {
                p0 = node.points[node.points.length - 2];
                p1 = node.points[node.points.length - 1];
            }

            // Linear interpolation
            const t = (seconds - p0.x) / (p1.x - p0.x);
            const result = p0.y + t * (p1.y - p0.y);

            iterableAssignment(msg, outputKeys, result);
            node.send(msg);
        });
    }
    RED.nodes.registerType("time-curve", timeCurve);
}

