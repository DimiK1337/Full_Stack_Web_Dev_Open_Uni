interface CoursePartBase {
  name: string;
  exerciseCount: number;
};

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group'
};

interface CoursePartDesc extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDesc {
  kind: 'basic'
};

interface CoursePartBackground extends CoursePartDesc {
  backgroundMaterial: string;
  kind: 'background'
};

interface CoursePartSpecial extends CoursePartDesc {
  kind: 'special';
  requirements: string[];
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;
