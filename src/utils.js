import { Position } from "reactflow";

export function getSourceHandlePosition(direction) {
  return Position.Bottom;
  // switch (direction) {
  //   case "TB":
  //     return Position.Bottom;
  //   case "BT":
  //     return Position.Top;
  //   case "LR":
  //     return Position.Right;
  //   case "RL":
  //     return Position.Left;
  // }
}

export function getTargetHandlePosition(direction) {
  return Position.Top;
  // switch (direction) {
  //   case "TB":
  //     return Position.Top;
  //   case "BT":
  //     return Position.Bottom;
  //   case "LR":
  //     return Position.Left;
  //   case "RL":
  //     return Position.Right;
  // }
}

export function getId() {
  return `${Date.now()}`;
}
