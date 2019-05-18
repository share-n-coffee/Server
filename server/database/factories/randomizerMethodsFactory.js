const EventPairsSchema = require('../models/eventPairs');
const EventReserveSchema = require('../models/eventReserve');
const isNull = require('../../utilities/isNull');

function randomizerMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const EventPairs = EventPairsSchema(modelNames.eventPairs);
  const EventReserve = EventReserveSchema(modelNames.eventReserve);

  // методы для Рандомайзера //
  const updateEventPairs = eventPairsObj => {
    const newEventPairsObj = new this.EventPairs(eventPairsObj);

    return new Promise((resolve, reject) => {
      newEventPairsObj.save((err, addedEventPairs) => {
        if (err) reject(err);
        resolve(addedEventPairs);
      });
    });
  };

  const insertEventPairs = eventPairsObj => {
    const newEventPair = new EventPairs(eventPairsObj);

    return new Promise((resolve, reject) => {
      newEventPair.save((err, addedEventPair) => {
        if (err) reject(err);
        resolve(addedEventPair);
      });
      console.log(`Пары к событию ${eventPairsObj.eventId} добавлены.`);
    });
  };

  const removeEventPairs = () => {
    return EventPairs.deleteMany({}, (err, data) =>
      console.log('Данные удалены')
    );
  };

  const getEventPairsById = id => {
    return EventPairs.findOne({ eventId: id }).exec();
  };

  const insertPair = (id, pairObject) => {
    return EventPairs.findOneAndUpdate(
      { eventId: id },
      { $push: { pairs: pairObject } }
    );
  };

  return {
    updateEventPairs,
    insertEventPairs,
    removeEventPairs,
    getEventPairsById,
    insertPair
  };
}

module.exports = randomizerMethodsFactory;
