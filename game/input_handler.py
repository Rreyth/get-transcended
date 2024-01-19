def	input_handler(core, player, pg):
	if core.keyboardState[pg.K_ESCAPE]:
		core.quit()
	if core.keyboardState[pg.K_UP]:
		player.moveUp()
	if core.keyboardState[pg.K_DOWN]:
		player.moveDown()