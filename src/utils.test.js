import { getOrderNumber, sortByOrderNumber } from "./utils"

const notification1 = {
  id: "4OI0c8IgI6Dm0",
  alertType: "warning",
  whereShown: '["Oma Opintopolku"]',
  name:  "Oma Opintopolku häiriö 1",
  hairionKuvaus: "Kaikki palaa",
  order: '1.0',
};

const notification2 = {
  id: "3aD0e9o2P81o",
  alertType: "info",
  whereShown: '["Oma Opintopolku"]',
  name:  "Oma Opintopolku häiriö 2",
  hairionKuvaus: "This is fine",
  order: '2.0',
};

const notification3 = {
  id: "kL3v912jDsq",
  alertType: "error",
  whereShown: '["Oma Opintopolku"]',
  name:  "Oma Opintopolku häiriö 3",
  hairionKuvaus: "IllegalAuthorityException",
  order: '3.0',
};

const notificationWithoutOrder1 = {
  id: "3krT5728j4iL",
  alertType: "error",
  whereShown: '["Oma Opintopolku"]',
  name:  "Oma Opintopolku häiriö 4",
  hairionKuvaus: "Poistukaa rauhassa. Tässä ei ole mitään nähtävää.",
};

const notificationWithoutOrder2 = {
  id: "rLj2069dGs2",
  alertType: "error",
  whereShown: '["Oma Opintopolku"]',
  name:  "Oma Opintopolku häiriö 5",
  hairionKuvaus: "Hui Haamu"
};

describe('getOrderNumber', () => {
  test('should return order number from notification', () => {
    expect(getOrderNumber(notification1)).toEqual(1);
  });


  test("should return Number.MAX_VALUE for a notification that doesn't have order number defined", () => {
    expect(getOrderNumber(notificationWithoutOrder1)).toEqual(Number.MAX_VALUE);
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
