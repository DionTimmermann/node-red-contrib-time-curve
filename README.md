# Time Curve
**node-red-contrib-time-curve**

This node takes a timestamp input and outputs a percentage (float in the range 0.0 to 100.0 inclusive) based on the time of day of the timestamp.

This node functions as an analogue time clock, e.g. a time-based dimmer. It can be seen as a dual component to the [light-scheduler node](https://flows.nodered.org/node/node-red-contrib-light-scheduler). I specifically designed it to program the brightness of aquarium lamps.  

This node is intentionally much simpler than other solutions like homeassistant's [adaptive lighting](https://github.com/basnijholt/adaptive-lighting), since there are applications where more than a fade in and fade out per day is deried and where dependence on time of day is more important than dependence on the sun position. 

![Alt text](https://raw.githubusercontent.com/jcronq/node-red-contrib-spline-curve/master/images/ColorTemperature_practical.PNG)

## Configuration
You can move points directly in the graph by clicking and dragging, add new points by clicking anywhere on the graph where one does not already exist, and delete points by right clicking them.

Values between points are interpolated linearly, i.e. connected by a straight line. The last and first point are connected so that there is no jump in values at midnight.  

![Alt text](https://raw.githubusercontent.com/jcronq/node-red-contrib-spline-curve/master/images/sunsetCurve_edit.PNG)

## Attribution
This node is based on the [soline-curve node by Jason Cronquist](https://flows.nodered.org/node/node-red-contrib-spline-curve).