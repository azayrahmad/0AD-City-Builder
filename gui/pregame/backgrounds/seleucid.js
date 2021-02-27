g_BackgroundLayerData.push(
	[
		{
			"offset": (time, width) => 0.10 * width * Math.cos(0.05 * time),
			"sprite": "background-seleucid",
			"tiling": true,
		},
		{
			"offset": (time, width) => 0.70 * width * Math.cos(0.05 * time),
			"sprite": "background-fog",
			"tiling": true,
		}
	]);
