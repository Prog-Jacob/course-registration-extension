# Course Registration Assistant

The Course Registration Assistant is a Chrome extension designed to streamline the course registration process for students. Avoid the hassle of schedule conflicts, customize your schedule, and register for all your courses at ease!

# Table of Contents

- [Preview](#preview)
- [Features](#features)
- [Installation](#installation)
  - [Chrome/Edge/Opera/Etc.](#chromeedgeoperaetc)
  - [Firefox.](#firefox)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

<a name="preview"></a>

## Preview

<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/Schedule.png" height="205"></img>
<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/ScheduleDetails.png" height="205"></img>
<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/FormOptions.png" width="23%"></img>
<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/CourseCustomization.png" width="23%"></img>
<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/CourseAddition.png" width="23%"></img>
<img src="https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/assets/SchedulePage.png" width="23%"></img>

<a name="features"></a>

## Features

- **Course Navigation:** View your courses in a single run without the need of multiple prolonged requests.

- **Registration Customization:** Tailor your registration needs with a range of customizable options, including timing, credit hours, groups, and sections.

- **Time Management:** Exclude specific dates to accommodate personal commitments or ensure availability during important events.

- **Priority-Based Selection:** Prioritize your important courses by enforcing or ordering them.

- **Advanced Course Management:** Control your course list with features to exclude undesired courses, group mutually-exclusive courses, or bundle co-requisite courses together.

- **Streamlined Course Addition:** Easily include full courses automatically or manually add courses, with options for advisor-assisted additions when needed.

- **Printable Schedules:** Print your generated schedules for quick reference and offline use.

<a name="installation"></a>

## Installation

<a name="chromeedgeoperaetc"></a>

#### Chrome/Edge/Opera/Etc:

1. [Click to download extension](https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/v1.3.4/course_registration_assistant-1.3.4.zip).

2. Follow the following instructions:

https://github.com/Prog-Jacob/course-registration-extension/assets/84212225/03ac2ba8-422d-4552-af3a-279c36668ed5

<a name="firefox"></a>

#### Firefox:

1. [Click to download extension](https://raw.githubusercontent.com/Prog-Jacob/course-registration-extension/master/releases/v1.3.4/course_registration_assistant-1.3.4.xpi).

2. Follow the following instructions:

https://github.com/Prog-Jacob/course-registration-extension/assets/84212225/26abd4d8-8cf2-4231-af6c-68a4da2e714b

<a name="usage"></a>

## Usage

1. Navigate to your university's Student Information System (SIS) page.
2. Open the Course Registration Assistant extension by clicking on its icon in the Chrome toolbar.
3. Customize your course preferences using the available options.
4. Generate multiple schedule options and review them to ensure they meet your requirements.
5. Select your preferred schedule and register for your courses accordingly.

<a name="contributing"></a>

## Contributing

Contributions to the Course Registration Assistant are welcome! If you encounter any bugs or have suggestions for new features, please open an issue at the top of the page. To implement the changes yourself, please follow these steps:

1. Fork the repository and clone it to your development machine.
2. Make the required changes on the forked repository.
3. Submit a pull request with a helpful description of the changes.

#### Get Started
- Install dependencies:
```bash
npm install
```
- Install `web-ext` globally:
```bash
npm i -g web-ext
```
- Build and watch for code changes:
```bash
npm run start
```
- Serve and watch `build` folder for changes:
```bash
web-ext run --source-dir build --target chromium --target firefox-desktop
```
At this point, an open Chromium and Firefox tabs with the extension installed are there. You may modify the extension and watch the changes reflecting there automatically. After making the desired changes:
- Format the code:
```bash
npm run format
```
- Build an optimized production version:
```bash
npm run build
```
- Resolve all errors if any:
```bash
web-ext lint --source-dir build --self-hosted
```
<a name="license"></a>

## License

The Course Registration Assistant is licensed under the [MIT License](./LICENSE).
