import game.config as conf

def update_all(core, delta):
	#update conf
	new_size = core.win.get_size()
	conf.winWidth = new_size[0]
	conf.winHeight = new_size[1]
	conf.wallDist = conf.winHeight * 0.05
	conf.speed_per_sec = conf.winHeight
	conf.speed = conf.speed_per_sec * delta
	# conf.textSize = conf.winHeight * 0.05
	# conf.textDist = -(conf.winHeight * 0.007)
	
	#update players
	for player in core.players:
		player.update()
 
	#update Walls
	for wall in core.walls:
		wall.update()
	
	#update Ball
 
	core.ball.update(core.walls, core.players)