"use client"

import React from "react";
import { useState } from "react";
import Clarifai from 'clarifai';
import Head from "next/head";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Image } from "@nextui-org/image";
import '../app/global.css'


//Calling the Api
const app = new Clarifai.App({
  apiKey: //Add your api key,
});


//Main Function
export default function Home() {
  //Declaring 
  const defaultImageUrl = "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg";
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [imageDetails, setImageDetails] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');


  //function when press the anlayze button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageDetails(null);
    setDescription('');
    setError('');

    try {
      const response = await app.models.predict(Clarifai.GENERAL_MODEL, imageUrl);
      const concepts = response.outputs[0].data.concepts;
      setImageDetails(concepts);
      setDescription(generateDescription(concepts));
    }
    catch (err) {
      setError('Failed to analyze image. Please Try Again or contact the owner')
    }
  };

  // description for different type of images generated
  const generateDescription = (concepts) => {
    const conceptNames = concepts.map((concept) => concept.name.toLowerCase());
    let description = 'This Image contains ';

    const peoples = ['man', 'woman', 'boy', 'girl'];
    const animals = ['dog', 'cat', 'bird', 'horse', 'cow', 'sheep'];
    const fruits = ['apple', 'banana', 'mango', 'orange', 'grape', 'strawberry'];
    const vehicles = ['car', 'bike', 'bicycle', 'motorcycle', 'truck'];

    const person = conceptNames.find((name) => peoples.includes(name));
    const animal = conceptNames.find((name) => animals.includes(name));
    const fruit = conceptNames.find((name) => fruits.includes(name));
    const vehicle = conceptNames.find((name) => vehicles.includes(name));

    if (person) {
      description += person;
      if (conceptNames.includes(smile)) {
        description += ' smiling';
      }
      description += `a person, specifically a ${person}.`;
    } else if (animal) {
      description += `an animal, specifically a ${animal}.`;
    } else if (fruit) {
      description += `a fruit, specifically a ${fruit}.`;
    } else if (vehicle) {
      description += `a vehilce, specifically a ${vehicle}.`;
    } else {
      description += 'the following items: ' + conceptNames.join(', ') + '.';
    }

    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  return (
    <div className="bg-neutral-950">
      <div className="relative h-20 bg-black">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>
      <div className="mt-20 ">
        <h1 className="text-6xl text-white font-bold text-center p-2 tracking-tight">Snap & Know :</h1>
        <h1 className="text-6xl text-white font-bold text-center p-3 tracking-tight"><span className="gradient-text"> Your Image Insights</span> Hub.</h1>
        <div className="flex text-white items-center justify-center">
          <p
            className="
                        p-10
                        text-center
                        text-lg
                    "
          >
            Upload your image's link and instantly discover what's inside,
            <br />
            from<span className="font-bold gradient-text-green"> vibrant green veggies to Beautiful Mountains.</span>
            <br />
            Your photo, our analysis!
          </p>
        </div>
      </div>

      <div className="flex items-center h-64 mx-auto w-full justify-center">
        <div className="flex w-full max-w-sm mt-[-170px] items-center space-x-2">
          <form onSubmit={handleSubmit}>
            <Input className="ml-10 w-80 bg-black text-white "
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Link of the Image"
            />
            <br></br>
            <Button
              className="ml-40 bg-white  text-black hover:bg-gray-300"
              type="submit"
            >
              Analyze
            </Button>
          </form>
        </div>
      </div>
      <div className="flex items-center p-8 justify-center mt-[-120px] min-h-screen bg-neutral-900">
        <div className=" bg-neutral-800 max-w-xl  justify-center p-6 rounded-lg ">
          <h1 className="text-white text-2xl font-bold">Details</h1>
          <br />
          <div className="max-w-lg rounded bg-neutral-700 overflow-hidden shadow-lg">
            {imageUrl && (
              <img className="w-full" src={imageUrl} alt="Sunset in the mountains" />
            )}
            <div className="px-6 py-4">
              <div className="font-bold text-white text-xl mb-2">Image Description</div>
              {description && (
                <p className="text-white text-base">
                  {description}
                </p>
              )}
            </div>
            {imageDetails && (
              <div>
                <div className="px-6 pt-4 pb-2">
                  {imageDetails.map((detail) => (
                    <span key={detail.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {`${detail.name} (${(detail.value * 100).toFixed(2)}%)`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
