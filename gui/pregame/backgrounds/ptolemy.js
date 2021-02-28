g_BackgroundLayerData.push(
	[
		{
			"offset": (time, width) => 0.05 * width * Math.cos(0.05 * time),
			"sprite": "background-ptolemy",
			"tiling": true,
		},
		{
			"offset": (time, width) => 0.70 * width * Math.cos(0.05 * time),
			"sprite": "background-fog",
			"tiling": true,
		}
	]);
