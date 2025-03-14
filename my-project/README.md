# Frontend Developer Test Task

This test task is designed to evaluate frontend development skills in creating interactive 3D scenes using React and TypeScript. Candidates can choose between two Variants of the task: a simple version focused on building creation and manipulation, or an advanced version that includes constraint-based building placement.

## Technical Requirements

### Core Technologies

- React
- TypeScript
- Mantine Components Framework (required for UI components)

### Additional Requirements

- Any 3D or 2D framework of your choice
- Project must be buildable and runnable locally with simple npm install / npm run dev commands

**Optional**
- Docker configuration for simplified setup

## Submission Guidelines

1. Fork this repository
2. Implement your solution
3. Create a pull request to submit your work

## Evaluation Criteria

- You can choose either the simple or advanced version based on your experience level
- This task reflects real project requirements from our backlog
- Focus on stable and extendable code over perfect visual implementation

## Task Description

[Figma Link](https://www.figma.com/design/Krz07KdbHtCVjuGZTm5AIU/FunkFlow-Building-Geometry-Challenge?node-id=17-6370&m=dev)

design files pass: Test_task

### Simple Version: "Create Building"

In this version, you'll create a 3D scene where users can add and manipulate buildings with various parameters.

<img src="design-files/ver_1/0.png" alt="Building Customization" width="400"/>

#### Key Features

1. **Add New Building**

- Add a new building to the 3D scene

<img src="design-files/ver_1/1.png" alt="Building Customization" width="400"/>

2. **Building Customization**

- Scale building using a popover menu

- Adjust building dimensions using frame controls

<img src="design-files/ver_1/2.png" alt="Building Manipulation" width="400"/>
<img src="design-files/ver_1/3.png" alt="Building Manipulation" width="400"/>
<img src="design-files/ver_1/4.png" alt="Building Manipulation" width="400"/>
<img src="design-files/ver_1/5.png" alt="Building Manipulation" width="400"/>

3. **Building Manipulation**

- Move buildings within the scene

<img src="design-files/ver_1/6.png" alt="Building Manipulation" width="400"/>

4. **Building Removal**

- Delete buildings from the scene

<img src="design-files/ver_1/7.png" alt="Building Removal" width="400"/>

### Advanced Version: "Create Constraint + Building"

This version extends the basic functionality by adding constraints that define building placement rules.

<img src="design-files/ver_2_adv/0.png" alt="Constraint Creation" width="400"/>

#### Key Features

1. **Constraint Creation**

- Draw constraint base area
- Set constraint height

<img src="design-files/ver_2_adv/1.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/2.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/3.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/4.png" alt="Building Customization" width="400"/>

- Ability to create several constraints

<img src="design-files/ver_2_adv/6.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/7.png" alt="Building Customization" width="400"/>

2. **Building Creation**

- Add buildings within defined constraints
- Ensure buildings respect height and area limitations

<img src="design-files/ver_2_adv/11.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/12.png" alt="Building Customization" width="400"/>

3. **Building Customization**

- Scale buildings using popover menu
- Adjust dimensions using frame controls

<img src="design-files/ver_2_adv/13.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/14.png" alt="Building Customization" width="400"/>

4. **Object Manipulation**

- Move and rotate buildings within constraints
- Delete buildings or constraints

<img src="design-files/ver_2_adv/16.png" alt="Building Customization" width="400"/>
<img src="design-files/ver_2_adv/17.png" alt="Building Customization" width="400"/>

## Questions?

If you have any questions about the task requirements, please create an issue in this repository.
