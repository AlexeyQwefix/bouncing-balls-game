const roundSpeed = (number: number) => Math.trunc(number * 1000) / 1000;
const roundPos = (number: number) => Math.floor(number * 10) / 10;

export const calcSpeed = (
  speed: number,
  position: number,
  radius: number,
  maxPosition: number,
  perFrameSpeedRate: number,
  collisionSpeedRate: number
) => {
  if (
    (position + radius >= maxPosition && speed > 0) ||
    (position - radius <= 0 && speed < 0)
  ) {
    return roundSpeed(-speed * collisionSpeedRate);
  }
  return roundSpeed(speed * perFrameSpeedRate);
};

export const calcPosition = (
  speed: number,
  position: number,
  radius: number,
  maxPosition: number
) => {
  const newPosition = position + speed;
  if (newPosition - radius < 0) {
    return radius;
  }
  if (newPosition + radius > maxPosition) {
    return maxPosition - radius;
  }
  return roundPos(newPosition);
};
