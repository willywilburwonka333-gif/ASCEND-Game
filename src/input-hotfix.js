import Phaser from 'phaser';

const attach = () => {
  const game = Phaser.GAMES?.find(Boolean);
  if (!game) {
    window.setTimeout(attach, 100);
    return;
  }

  const bindScene = (scene) => {
    if (!scene || scene.__ascendInputHotfixBound) return;
    scene.__ascendInputHotfixBound = true;

    const closeGuidanceModal = () => {
      if (!scene.modalOpen) return false;

      const modal = scene.children.list
        .filter((child) => child?.type === 'Container' && child.depth >= 6000)
        .sort((a, b) => b.depth - a.depth)[0];

      if (!modal) return false;

      const hasGuidanceTitle = modal.list?.some(
        (child) => child?.type === 'Text' && String(child.text || '').includes('Mira’s Guidance'),
      );

      if (!hasGuidanceTitle) return false;

      modal.destroy(true);
      scene.modalOpen = false;
      scene.player?.setVelocity?.(0, 0);
      return true;
    };

    scene.input.on('pointerdown', (pointer) => {
      if (!scene.modalOpen) return;

      // Guidance Continue button occupies this screen-space region.
      if (pointer.x >= 360 && pointer.x <= 600 && pointer.y >= 360 && pointer.y <= 470) {
        closeGuidanceModal();
      }
    });

    scene.input.keyboard?.on('keydown-ENTER', closeGuidanceModal);
    scene.input.keyboard?.on('keydown-SPACE', closeGuidanceModal);
    scene.input.keyboard?.on('keydown-ESC', closeGuidanceModal);
  };

  game.events.on(Phaser.Core.Events.POST_STEP, () => {
    game.scene.getScenes(true).forEach(bindScene);
  });

  game.scene.getScenes(true).forEach(bindScene);
};

attach();
