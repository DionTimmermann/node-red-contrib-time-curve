const secondsPerDay = 24 * 60 * 60;

module.exports = function(RED) {
    function timeCurve(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.input_property  = config.input_property  || "payload";
        node.output_property = config.output_property || "payload";

        let points;
        if (config.points === undefined) {
            points = [{
                x: Math.round(secondsPerDay/2),
                y: 50
            }];
        } else {
            points = config.points;
        }

        if (points.length === 0) {
            node.status({fill:"red",shape:"dot",text:"invalid config"});
            node.points = [];
        } else {
            node.points = [
                {
                    x: points[points.length - 1].x - secondsPerDay,
                    y: points[points.length - 1].y
                },
                ...points,
                {
                    x: points[0].x + secondsPerDay,
                    y: points[0].y
                }
            ];
            node.status({});
        }

        node.on('input', function(msg){
            if (node.points.length === 0) {
                return;
            }

            var value = RED.util.getMessageProperty(msg, node.input_property);
            const date = new Date(value);

            if (!value || isNaN(date.getTime())) {
                node.status({fill:"red",shape:"dot",text:"invalid timestamp"});
            } else {
                node.status({});
            }

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

            RED.util.setMessageProperty(msg,node.output_property, result);
            node.send(msg);
        });
    }
    RED.nodes.registerType("time-curve", timeCurve);
}

