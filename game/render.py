from .config import *

def render_game(core):
	core.win.fill((0, 0, 0)) 

	for player in core.players:
		player.draw(core.win)

	if core.walls:
		for wall in core.walls:
			wall.draw(core.win)

	if core.obstacle:
		core.obstacle.draw(core.win)

	core.ball.draw(core.win)

	render_text(core, core.players.__len__())
	

def render_text(core, nb_players):
	text = []
	if nb_players == 2:
		score = str(core.players[0].score) + " - " + str(core.players[1].score)
		names = [core.players[0].name, core.players[1].name]
		text = [core.font.render(score, True, (255, 255, 255)), core.font.render(names[0], True, (255, 255, 255)), core.font.render(names[1], True, (255, 255, 255))]
		pos = [((winWidth / 2) - (text[0].get_size()[0] / 2), textDist), (0, textDist), (winWidth - text[2].get_size()[0], textDist)]
	
	elif core.custom_mod == "1V1V1V1":
		pass
		# print("score:")
		# for player in core.players:
		# 	print(player.score)
 
	elif nb_players == 4:
		score = str(core.players[0].score) + " - " + str(core.players[2].score)
		names = [core.players[0].name, core.players[1].name, core.players[2].name, core.players[3].name]
		text = [core.font.render(score, True, (255, 255, 255))]
		for name in names:
			text.append(core.font.render(name, True, (255, 255, 255)))
		pos = [((winWidth / 2) - (text[0].get_size()[0] / 2), textDist),
         	(0, textDist),
			(text[1].get_size()[0] + 25, textDist),
          	(winWidth - text[2].get_size()[0], textDist),
           	(winWidth - (text[2].get_size()[0] * 2) - 25, textDist)]

	for i in range(text.__len__()):
		core.win.blit(text[i], pos[i])

def render_menu(core):
	core.win.fill((0, 0, 0)) 
	
	core.menu.draw(core.win)
 
def render_pause(core):
	render_game(core)

	alpha_surface = pg.Surface(core.winSize, flags = pg.SRCALPHA)
 
	alpha_surface.fill((0, 0, 0, 125))
	core.win.blit(alpha_surface, (0, 0))

	core.pause[1].draw(core.win)
	
def render_end(core):
	core.win.fill((0, 0, 0))
	
	if core.players.__len__() == 2:
		score = [core.players[0].score, core.players[1].score]
	elif core.players.__len__() == 4:
		score = [core.players[0].score, core.players[2].score]
	core.end.draw(core, core.win, score)
	
def render_start(core):
	render_game(core)
	
	alpha_surface = pg.Surface(core.winSize, flags = pg.SRCALPHA)
 
	alpha_surface.fill((0, 0, 0, 125))
	core.win.blit(alpha_surface, (0, 0))
 
	core.start_screen.draw(core.win)
 
def render_custom(core):
	core.win.fill((0, 0, 0))
	
	core.custom_menu.draw(core.win)