import { getOrderNumber, sortByOrderNumber } from "./utils"

const notification1 = {
  "alertType": {
    "fi": "warning"
  },
  "whereShown": {
    "fi": [
      "Oma Opintopolku"
    ]
  },
  "name": {
    "fi": "Oma Opintopolku häiriö 1",
    "sv": "Min Studieinfo störning 1"
  },
  "hairionKuvaus": {
    "fi": "Testiviesti suomeksi",
    "sv": "Testiviesti på svenska"
  },
  order: {
    fi: 1
  }
};

const notification2 = {
  "alertType": {
    "fi": "info"
  },
  "whereShown": {
    "fi": [
      "Oma Opintopolku"
    ]
  },
  "name": {
    "fi": "Oma Opintopolku häiriö 2",
    "sv": "Min Studieinfo störning 2"
  },
  "hairionKuvaus": {
    "fi": "Testiviesti 2 suomeksi",
    "sv": "Testiviesti 2 på svenska"
  },
  order: {
    fi: 3
  }
};

const notification3 = {
  "alertType": {
    "fi": "error"
  },
  "whereShown": {
    "fi": [
      "Oma Opintopolku"
    ]
  },
  "name": {
    "fi": "Oma Opintopolku häiriö 3",
    "sv": "Min Studieinfo störning 3"
  },
  "hairionKuvaus": {
    "fi": "Testiviesti 3 suomeksi",
    "sv": "Testiviesti 3 på svenska"
  },
  order: {
    fi: 3
  }
};

const notificationWithoutOrder1 = {
  "alertType": {
    "fi": "error"
  },
  "whereShown": {
    "fi": [
      "Oma Opintopolku"
    ]
  },
  "name": {
    "fi": "Oma Opintopolku häiriö 4",
    "sv": "Min Studieinfo störning 4"
  },
  "hairionKuvaus": {
    "fi": "Testiviesti 4 suomeksi",
    "sv": "Testiviesti 4 på svenska"
  },
};

const notificationWithoutOrder2 = {
  "alertType": {
    "fi": "error"
  },
  "whereShown": {
    "fi": [
      "Oma Opintopolku"
    ]
  },
  "name": {
    "fi": "Oma Opintopolku häiriö 5",
    "sv": "Min Studieinfo störning 5"
  },
  "hairionKuvaus": {
    "fi": "Testiviesti 5 suomeksi",
    "sv": "Testiviesti 5 på svenska"
  },
};

describe('getOrderNumber', () => {
  test('should return order number from notification', () => {
    expect(getOrderNumber(notification1, 1)).toEqual(1);
  });


  test("should return total number of notifications for a notification that doesn't have order number defined", () => {
    expect(getOrderNumber(notificationWithoutOrder1, 1)).toEqual(1);
  });
});

describe('sortByOrderNumber', () => {
  test('should return notifications in ascending order by notification order number', () => {
    const notifications = [
      notification2,
      notification3,
      notification1
    ];

    const sortedNotifications = [
      notification1,
      notification2,
      notification3
    ];

    expect(sortByOrderNumber(notifications)).toEqual(sortedNotifications)
  });

  test('should place notifications in last place if their order is not defined', () => {

    const notifications = [
      notificationWithoutOrder2,
      notification2,
      notificationWithoutOrder1,
      notification1
    ];

    const sortedNotifications = [
      notification1,
      notification2,
      notificationWithoutOrder2,
      notificationWithoutOrder1
    ];

    expect(sortByOrderNumber(notifications)).toEqual(sortedNotifications)
  });
});
