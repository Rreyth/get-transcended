from .config import *

def render_game(core):
	core.win.fill((0, 0, 0)) #clean screen

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
	core.win.fill((0, 0, 0)) #clean screen
	
	core.menu.draw(core.win)