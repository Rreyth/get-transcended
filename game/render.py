from .config import *

def render_game(core):
	core.win.fill((0, 0, 0)) 

	core.players[0].draw(core.win)
	core.players[1].draw(core.win)
	core.walls[0].draw(core.win)
	core.walls[1].draw(core.win)
	core.ball.draw(core.win)

	score = str(core.players[0].score) + " - " + str(core.players[1].score)

	names = [core.players[0].name, core.players[1].name]

	text = [core.font.render(score, True, (255, 255, 255)), core.font.render(names[0], True, (255, 255, 255)), core.font.render(names[1], True, (255, 255, 255))]

	core.win.blit(text[0], ((winWidth / 2) - (text[0].get_size()[0] / 2), textDist))
	core.win.blit(text[1], (0, textDist))
	core.win.blit(text[2], (winWidth - text[2].get_size()[0], textDist))
 
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
	
	core.end.draw(core, core.win)
	
def render_start(core):
	render_game(core)
	
	alpha_surface = pg.Surface(core.winSize, flags = pg.SRCALPHA)
 
	alpha_surface.fill((0, 0, 0, 125))
	core.win.blit(alpha_surface, (0, 0))
 
	core.start_screen.draw(core.win)