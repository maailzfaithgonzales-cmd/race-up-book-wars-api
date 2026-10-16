'use strict';

const SET_TITLE = 'Book Basics Demo';

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    await queryInterface.bulkInsert('question_sets', [{
      title: SET_TITLE,
      description: 'Five easy questions about books and Philippine literature.',
      subject: 'Literature',
      grade_level: 'Grade 7',
    }]);
    const [[set]] = await db.query(
      'SELECT set_id FROM question_sets WHERE title = :title',
      { replacements: { title: SET_TITLE } });

    const q = (text, choices, correct_index, difficulty) => ({
      set_id: set.set_id,
      text,
      type: 'MULTIPLE_CHOICE',
      choices: JSON.stringify(choices),
      correct_index,
      time_limit_sec: 30,
      difficulty,
    });

    await queryInterface.bulkInsert('questions', [
      q('Who wrote the novel Noli Me Tangere?',
        ['Jose Rizal', 'Andres Bonifacio', 'Emilio Aguinaldo', 'Apolinario Mabini'], 0, 'EASY'),
      q('What do we call the person who writes a book?',
        ['Editor', 'Publisher', 'Author', 'Librarian'], 2, 'EASY'),
      q('Which page of a book shows its title and author?',
        ['Index', 'Title page', 'Glossary', 'Appendix'], 1, 'EASY'),
      q('Which part of a book lists topics with their page numbers?',
        ['Preface', 'Epilogue', 'Dedication', 'Table of contents'], 3, 'MEDIUM'),
      q('Who wrote the poem Florante at Laura?',
        ['Francisco Balagtas', 'Jose Garcia Villa', 'Nick Joaquin', 'Lualhati Bautista'], 0, 'MEDIUM'),
    ]);

    await queryInterface.bulkInsert('book_effects', [
      { effect_type: 'MOVE_FORWARD', effect_value: 3 },
      { effect_type: 'MOVE_BACK', effect_value: 2 },
    ]);
  },

  async down(queryInterface) {
    const db = queryInterface.sequelize;
    const [[set]] = await db.query(
      'SELECT set_id FROM question_sets WHERE title = :title',
      { replacements: { title: SET_TITLE } });
    if (set) {
      await queryInterface.bulkDelete('questions', { set_id: set.set_id }, {});
    }
    await queryInterface.bulkDelete('question_sets', { title: SET_TITLE }, {});
    await queryInterface.bulkDelete('book_effects', { effect_type: ['MOVE_FORWARD', 'MOVE_BACK'] }, {});
  },
};