import { Point } from './Point';
import { Link } from './Link';

export interface Shape {
  links: Link[];
  points: Point[];
}
