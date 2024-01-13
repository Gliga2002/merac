import CustomError from './CustomError.js';

export default async function getRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new CustomError('Something went wrong', response.statusCode);
  }

  const resData = await response.json();

  return resData;
}
