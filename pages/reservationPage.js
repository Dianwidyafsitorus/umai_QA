// pages/reservationPage.js
const { expect } = require('@playwright/test');

class ReservationPage {
  constructor(page) {
    this.page = page;

    // Locators 
    this.makeReservationButton = page.getByRole('button', { name: 'Make a reservation' });
    this.popupReservation = page.getByText('KWC Automated');
    this.paxDropdown = page.locator('text=2 people');
    this.timeSlot = page.locator('#timeslot-dinner-0');

    this.firstName = page.getByPlaceholder('First name')
    this.lastName = page.getByText('Last name')
    this.phone = page.getByPlaceholder('Mobile number')
    this.email = page.getByPlaceholder('Email address')
    this.birthday = page.getByPlaceholder('Select your birthday dd/mm')
    this.promoCode = page.getByPlaceholder('Promo Code')

    this.termsCheckbox = page.getByLabel('I agree to UMAI\'s Terms of')
    this.confirmButton = page.locator('#ums-confirm-reservation-details-button')

    this.successMessage = page.locator('text=confirmed');

    this.addDietaryRestrictionsButton = page.locator('[id="um-tags-add-Dietary restrictions"]');
    this.popupDietary = page.locator('[id="um-tags-add-Dietary restrictions"]');
    this.optionDietary = page.locator('.um-tags-selector__checkbox').first();
    this.saveButton = page.getByText('Save');

    this.addSpecialOccasionButton = page.locator('[id="um-tags-add-Special occasions"]');

    this.waitlistButton = page.getByText('Waitlist', { exact: true });
    this.popupWaitlist = page.getByText('Don\'t see what you\'re looking');

    this.firstNameWaitlist = page.getByPlaceholder('First name');
    this.lastNameWaitlist = page.getByPlaceholder('Last name');
    this.phoneWaitlist = page.getByPlaceholder('Mobile number');
    this.emailWaitlist = page.getByPlaceholder('Email address');

    this.addMeToTheWaitlistButton = page.getByText('Add me to the Waitlist');

  }

  async goTo() {
    await this.page.goto('https://staging.reservation.umai.io/en/widget/kwc-automated');
    await this.page.waitForLoadState('networkidle');
  }

  async clickMakeReservation(){
    await this.makeReservationButton.click();
    await expect(this.popupReservation).toBeVisible();
  }

  async selectDate() {
  const today = new Date();

  const formatDate = (date) => {
    const day = date.getDate();

    const suffix =
      day === 1 || day === 21 || day === 31 ? 'st' :
      day === 2 || day === 22 ? 'nd' :
      day === 3 || day === 23 ? 'rd' : 'th';

    const month = date.toLocaleString('en-US', { month: 'long' });

    return `${day}${suffix} ${month}`;
  };

  const todayLabel = formatDate(today);

  await this.page
    .getByLabel(new RegExp(todayLabel))
    .first()
    .click();

  const noTableText = this.page.getByText('Days marked with are fully');

  const isNoTableVisible = await noTableText
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  if (isNoTableVisible) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + 2);

    const nextLabel = formatDate(nextDate);

    await this.page
      .getByLabel(new RegExp(nextLabel))
      .first()
      .click();
   }
 }

  async selectPax() {
    await this.paxDropdown.click();
  }

  async selectTime(time) {
    await this.timeSlot.click();
  }

  async fillContactDetails(data) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.phone.fill(data.phone);
    await this.email.fill(data.email);
    await this.birthday.fill(data.birthday);

    // promoCode optional
    if (data.promoCode) {
      await this.promoCode.fill(data.promoCode);
    }
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async confirmReservation() {
    await this.confirmButton.click();
  }

  async verifySuccess() {
    await this.successMessage.waitFor({ timeout: 10000 });
  }

  async addDietaryRestrictions() {
    await this.addDietaryRestrictionsButton.click();
  }

  async fillDietaryOption(){
    await expect(this.popupDietary).toBeVisible();
    await this.optionDietary.click();
    await this.saveButton.click();
  }

  async addSpecialOccasion() {
    await this.addSpecialOccasionButton.click();
  }

  async fillSpecialOccasion(optionText){
    await this.page
    .getByLabel('Reservation tags')
    .getByText(optionText)
    .click();
    await this.saveButton.click();
  }

  async assertAllRequiredErrors() {
    const requiredFields = [
        'First name',
        'Last name',
        'Phone number',
        'Email',
        'Birthday'
    ];

    for (const field of requiredFields) {
        await expect(
        this.page.getByText(new RegExp(`${field}.*required`, 'i'))
        ).toBeVisible();
    }
  }

  async clickWaitlist() {
    await this.waitlistButton.scrollIntoViewIfNeeded();
    await this.waitlistButton.click();
  }

  async assertWaitlistFormVisible(){
    await expect(this.popupWaitlist).toBeVisible();
  } 

  async fillContactDetailsWaitlist(data) {
    await this.firstNameWaitlist.fill(data.firstName);
    await this.lastNameWaitlist.fill(data.lastName);
    await this.phoneWaitlist.fill(data.phone);
    await this.emailWaitlist.fill(data.email);
  }

 async submitWaitlist(){
    await this.addMeToTheWaitlistButton.click();
 }

 async assertWaitlistSuccess() {
  await expect(this.page.getByText('There\'s a table available!')).toBeVisible();
  await expect(this.page.getByText('view table')).toBeVisible();
 }

}

module.exports = { ReservationPage };