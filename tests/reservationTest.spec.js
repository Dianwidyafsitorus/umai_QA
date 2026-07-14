// tests/reservation.spec.js

const { test, expect } = require('@playwright/test');
const { ReservationPage } = require('../pages/reservationPage');

test.describe('TC-001 UMAI Reservation (No Payment)', () => {

  test('Successful reservation with empty dietary & special occasions', async ({ page }) => {

    const reservation = new ReservationPage(page);

    // Test data
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      phone: '+6282290876898',
      email: `test${Date.now()}@mail.com`,
      birthday: '01/01',
      promoCode: '' // empty
    };

    // Step 0
    await reservation.goTo();
    await reservation.clickMakeReservation();

    // Step 1–3
    await reservation.selectDate();
    await reservation.selectPax();
    await reservation.selectTime();

    // Step 4
    await reservation.fillContactDetails(userData);

    // Step 5
    await reservation.acceptTerms();

    // Step 6
    await reservation.confirmReservation();

    // Assertion
    await reservation.verifySuccess();
  });

});

test.describe('TC-002 UMAI Reservation (Dietary Restrictions - No Payment)', () => {

  test('Successful reservation with Dietary restrictions', async ({ page }) => {

    const reservation = new ReservationPage(page);

    // Test data
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      phone: '+6282290876898',
      email: `test${Date.now()}@mail.com`,
      birthday: '01/01',
      promoCode: '' // empty
    };

    // Step 0
    await reservation.goTo();
    await reservation.clickMakeReservation();

    // Step 1–3
    await reservation.selectDate();
    await reservation.selectPax();
    await reservation.selectTime();

    // Step 4
    await reservation.fillContactDetails(userData);

    // Step 5 and Step 6
    await reservation.addDietaryRestrictions();
    await reservation.fillDietaryOption();

    // Step 7 (empty special occasion → skip)

    // Step 8
    await reservation.acceptTerms();

    // Step 9
    await reservation.confirmReservation();

    // Assertion
    await reservation.verifySuccess();
  });

});

test.describe('TC-003 UMAI Reservation (Dietary + Special Occasion - No Payment)', () => {

  test('Successful reservation with Dietary & Special occasions', async ({ page }) => {

    const reservation = new ReservationPage(page);

    // Test data
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      phone: '+6282290876898',
      email: `test${Date.now()}@mail.com`,
      birthday: '01/01',
      promoCode: '' // empty
    };

    // Step 0
    await reservation.goTo();
    await reservation.clickMakeReservation();

    // Step 1–3
    await reservation.selectDate();
    await reservation.selectPax();
    await reservation.selectTime();

    // Step 4
    await reservation.fillContactDetails(userData);

    // Step 5–6 (Dietary)
     await reservation.addDietaryRestrictions();
    await reservation.fillDietaryOption();

    // Step 7–8 (Special Occasion)
    await reservation.addSpecialOccasion();
    await reservation.fillSpecialOccasion('Birthday');

    // Step 8 (Terms)
    await reservation.acceptTerms();

    // Step 9
    await reservation.confirmReservation();

    // Assertion
    await reservation.verifySuccess();
  });

});

test('TC-004 - Fail reservation when all contact details empty', async ({ page }) => {
  const reservation = new ReservationPage(page);

  await reservation.goTo();
  await reservation.clickMakeReservation();

  // Step 1–3
  await reservation.selectDate();
  await reservation.selectPax();
  await reservation.selectTime();

  // Step 4: skip all contact detail (INTENTIONALLY EMPTY)

  // Step 5
  await reservation.acceptTerms();

  // Step 6
  await reservation.confirmReservation();

  // Assertion
  await reservation.assertAllRequiredErrors();
});

test('TC-005 - Click waitlist button', async ({ page }) => {
  const reservation = new ReservationPage(page);

  // Step 1
  await reservation.goTo();
  await reservation.clickMakeReservation();

  // Step 2
  await reservation.selectDate();
  await reservation.clickWaitlist();

  // Assertion
  await reservation.assertWaitlistFormVisible();
});

test('TC-006 - Successfully add to waitlist', async ({ page }) => {
  const reservation = new ReservationPage(page);

  // Test data
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    phone: '+6282290876898',
    email: `test${Date.now()}@mail.com`,
  };

  // Step 1
  await reservation.goTo();
  await reservation.clickMakeReservation();

  // Step 2
  await reservation.selectDate();
  await reservation.clickWaitlist();

  // Step 3 
  await reservation.fillContactDetailsWaitlist(userData);
  
  // Step 4
  await reservation.submitWaitlist();

  // Assertion
  await reservation.assertWaitlistSuccess();
});
