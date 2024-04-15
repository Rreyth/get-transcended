from .config import *
from .Button import *

class End:
	def __init__(self):
		self.text_font = pg.font.Font(font, int(winHeight * 0.1))
		self.size = [winWidth * 0.2, winHeight * 0.1]
		self.button = Button("BACK TO MENU", (winWidth / 2) - (self.size[0] / 2), winHeight - (self.size[1] * 1.5), self.size[0], self.size[1], winHeight * 0.085)
  
  
	def draw(self, core, win, score):
		if core.custom_mod == "1V1V1V1":
			self.drawSquare(core, win, score)
			self.button = Button("BACK TO MENU", winWidth - self.size[0] - 50, winHeight - (self.size[1] * 1.5), self.size[0], self.size[1], winHeight * 0.085)
		else:
			text = [self.text_font.render(core.players[0].name, True, (255, 255, 255))]
			pos = [[(winWidth / 3) - (text[0].get_size()[0] / 2), (winHeight / 3) - (text[0].get_size()[1] /2)]]
			text.append(self.text_font.render(core.players[0].win, True, (255, 255, 255)))
			pos.append([(winWidth / 3) - (text[1].get_size()[0] / 2), (winHeight / 2) - (text[1].get_size()[1] /2)])
			text.append(self.text_font.render(str(score[0]), True, (255, 255, 255)))
			pos.append([(winWidth / 2) - 75, (winHeight / 2) - (text[2].get_size()[1] /2)])
	
			text.append(self.text_font.render(core.players[1].name, True, (255, 255, 255)))
			pos.append([(winWidth / 3 * 2) - (text[3].get_size()[0] / 2), (winHeight / 3) - (text[3].get_size()[1] /2)])
			text.append(self.text_font.render(core.players[1].win, True, (255, 255, 255)))
			pos.append([(winWidth / 3 * 2) - (text[4].get_size()[0] / 2), (winHeight / 2) - (text[4].get_size()[1] /2)])
			text.append(self.text_font.render(str(score[1]), True, (255, 255, 255)))
			pos.append([(winWidth / 2) + 50, (winHeight / 2) - (text[5].get_size()[1] / 2)])

			text.append(self.text_font.render("_", True, (255, 255, 255)))
			pos.append([(winWidth / 2) - (text[6].get_size()[0] / 2), (winHeight / 2) - (text[6].get_size()[1] * 0.75)])
	
			if core.players.__len__() == 4:
				pos.append(pos[3].copy())
				pos[3][0] = pos[0][0]
				pos[0][0] -= (text[0].get_size()[0] + 50)
				text[4] = self.text_font.render(core.players[2].win, True, (255, 255, 255))
				text.append(self.text_font.render(core.players[2].name, True, (255, 255, 255)))
				text.append(self.text_font.render(core.players[3].name, True, (255, 255, 255)))
				pos.append([pos[7][0] + text[7].get_size()[0] + 50, pos[7][1]])

			for i in range(text.__len__()):
				win.blit(text[i], pos[i])

		self.button.draw(win)

	def drawSquare(self, core, win, score):
		names = [self.text_font.render(core.players[0].name, True, (255, 255, 255)),
          		self.text_font.render(core.players[1].name, True, (255, 255, 255)),
            	self.text_font.render(core.players[2].name, True, (255, 255, 255)),
             	self.text_font.render(core.players[3].name, True, (255, 255, 255))]
	
		points = [self.text_font.render(str(score[0]), True, (255, 255, 255)),
            	self.text_font.render(str(score[1]), True, (255, 255, 255)),
             	self.text_font.render(str(score[2]), True, (255, 255, 255)),
			  	self.text_font.render(str(score[3]), True, (255, 255, 255))]

		wins = [self.text_font.render(core.players[0].win, True, (255, 255, 255)),
				self.text_font.render(core.players[1].win, True, (255, 255, 255)),
				self.text_font.render(core.players[2].win, True, (255, 255, 255)),
				self.text_font.render(core.players[3].win, True, (255, 255, 255))]
  
		names_pos = [[(winWidth / 5) - (names[0].get_size()[0] / 2), (winHeight / 2) - (names[0].get_size()[1] /2)],
					[(winWidth / 5 * 4) - (names[1].get_size()[0] / 2), (winHeight / 2) - (names[1].get_size()[1] /2)],
               		[(winWidth / 2) - (names[2].get_size()[0] / 2), (winHeight / 8) - (names[2].get_size()[1] /2)],
                 	[(winWidth / 2) - (names[3].get_size()[0] / 2), (winHeight / 8 * 7) - (names[3].get_size()[1] /2)]]

		points_pos = [[(winWidth / 3) - (points[0].get_size()[0] / 2) + names[0].get_size()[0] + 50, (winHeight / 2) - (points[0].get_size()[1] /2)],
					[(winWidth / 3 * 2) - (points[1].get_size()[0] / 2) - names[1].get_size()[0] - 50, (winHeight / 2) - (points[1].get_size()[1] /2)],
               		[(winWidth / 2) - (points[2].get_size()[0] / 2), (winHeight / 3) - (points[2].get_size()[1] /2) + 50],
                 	[(winWidth / 2) - (points[3].get_size()[0] / 2), (winHeight / 3 * 2) - (points[3].get_size()[1] /2) - 50]]

		wins_pos = [[(winWidth / 5 * 2) - (wins[0].get_size()[0] / 2), (winHeight / 2) - (wins[0].get_size()[1] /2)],
					[(winWidth / 5 * 3) - (wins[1].get_size()[0] / 2), (winHeight / 2) - (wins[1].get_size()[1] /2)],
               		[(winWidth / 2) - (wins[2].get_size()[0] / 2), (winHeight / 4) - (wins[2].get_size()[1] /2)],
                 	[(winWidth / 2) - (wins[3].get_size()[0] / 2), (winHeight / 4 * 3) - (wins[3].get_size()[1] /2)]]

		for i in range(names.__len__()):
				win.blit(names[i], names_pos[i])
				win.blit(points[i], points_pos[i])
				win.blit(wins[i], wins_pos[i])
  
	async def click(self, core, mousePos):
		if self.button.hitbox.collidepoint(mousePos):
			core.state = "menu"
			core.mode = "none"
			core.pause[0] = False
			core.pause[1].freeze = False
			core.start_screen = False
			core.wait_screen = False
			core.ai = []
			core.max_score = 10

