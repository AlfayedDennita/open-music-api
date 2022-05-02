/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'char(29)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'char(25)',
      notNull: true,
    },
    song_id: {
      type: 'char(21)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlistsongs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
