"use client";

import { TextMd } from "@/components/Text";
import React, { useState, useRef, useEffect } from 'react';  
import Image from "next/image";
import Link from "next/link";
import { useTuteeForm } from "@/contexts/TuteeFormContext";

export default function TuteeForm4() {
  const { formData, updateFormData } = useTuteeForm();

  const handleSubmit = async () => {  
    try {  
      updateFormData({  
        minBudget: minValue,  
        maxBudget: maxValue  
      });  

      console.log('Submitting form data:', {  
        ...formData,  
        minBudget: minValue,  
        maxBudget: maxValue  
      });  

      const response = await fetch('/api/tutee-form', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          ...formData,  
          minBudget: minValue,  
          maxBudget: maxValue  
        })  
      });  
  
      console.log('Response status:', response.status);  
      console.log('Response headers:', Object.fromEntries(response.headers.entries())); 
  
      if (!response.ok) {  
        const errorText = await response.text();  
        console.error('Error response text:', errorText);  
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);  
      }  
  
      try {  
        const responseData = await response.json();  
        console.log('Server Response:', responseData);  
      } catch (jsonError) {  
        console.error('JSON parsing error:', jsonError);  
        throw new Error('Failed to parse server response');  
      }  
    } catch (error) {  
      console.error('Submission error:', error);  
      
      alert(error instanceof Error ? error.message : 'Submission failed');  
    }  
  };   

  const [mounted, setMounted] = useState(false);  
  const [minValue, setMinValue] = useState(30000);  
  const [maxValue, setMaxValue] = useState(200000);  
  const minLimit = 0;  
  const maxLimit = 300000;  
  const priceGap = 50000;  

  const sliderProgressRef = useRef<HTMLDivElement>(null);  
  const minRangeRef = useRef<HTMLInputElement>(null);  
  const maxRangeRef = useRef<HTMLInputElement>(null);  

  // Modify to round to nearest 1000  
  const roundToNearestThousand = (value: number) => {  
    return Math.round(value / 1000) * 1000;  
  };  

  const updateSliderProgress = (min: number, max: number) => {  
    if (sliderProgressRef.current) {  
      const left = (min / maxLimit) * 100;  
      const width = ((max - min) / maxLimit) * 100;  
      
      sliderProgressRef.current.style.left = `${left}%`;  
      sliderProgressRef.current.style.width = `${width}%`;  
    }  
  };  

  useEffect(() => {  
    setMounted(true);  
    updateSliderProgress(minValue, maxValue);  
  }, []);  

  useEffect(() => {  
    if (mounted) {  
      updateSliderProgress(minValue, maxValue);  
    }  
  }, [mounted, minValue, maxValue]); 

  const handleRangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const isMinSlider = e.target.classList.contains('range-min');  
    const currentMin = parseInt(minRangeRef.current?.value || '0');  
    const currentMax = parseInt(maxRangeRef.current?.value || '300000');  

    let newMinValue = currentMin;  
    let newMaxValue = currentMax;  

    // Round to nearest thousand  
    newMinValue = roundToNearestThousand(newMinValue);  
    newMaxValue = roundToNearestThousand(newMaxValue);  

    if (isMinSlider) {  
      newMinValue = Math.max(minLimit, Math.min(newMinValue, newMaxValue - priceGap));  
      newMaxValue = Math.max(newMinValue + priceGap, newMaxValue);  
    } else {  
      newMaxValue = Math.min(maxLimit, Math.max(newMaxValue, newMinValue + priceGap));  
      newMinValue = Math.min(newMaxValue - priceGap, newMinValue);  
    }  

    setMinValue(newMinValue);  
    setMaxValue(newMaxValue);  

    if (minRangeRef.current) minRangeRef.current.value = newMinValue.toString();  
    if (maxRangeRef.current) maxRangeRef.current.value = newMaxValue.toString();  

    updateSliderProgress(newMinValue, newMaxValue);  
  };  

  useEffect(() => {  
    updateSliderProgress(minValue, maxValue);  
  }, [minValue, maxValue]);  

  if (!mounted) return null;
  
  return (  
    <div className="h-screen w-full flex">  
      <div className="w-[30%] bg-[#FFFFFF] p-4 flex items-center justify-center">  
        <Image 
          src="/assets/TuteeFormPage4.png"
          alt="Tutee Form"
          width={500}
          height={0}
        />
      </div>
      <div className="w-[70%] bg-[#F0FAF9]">
        <div className="h-screen w-full">  
          <div className="h-[15%] flex justify-center items-center">  
            <Link href="/tutee-form/tutee-form1" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image 
                src="/assets/CheckList.png"
                alt="done"
                width={15}
                height={0}
              />
            </Link> 

            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            
            <Link href="/tutee-form/tutee-form2" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image 
                src="/assets/CheckList.png"
                alt="done"
                width={15}
                height={0}
              />
            </Link>
            
            <div className="w-[5%] border-1 border-[#1F65A6]"></div>   
            <Link href="/tutee-form/tutee-form3" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center">  
              <Image 
                src="/assets/CheckList.png"
                alt="done"
                width={15}
                height={0}
              />
            </Link>
            
            <div className="w-[5%] border-1 border-[#1F65A6]"></div>  
            <Link href="/tutee-form/tutee-form4" className="w-12 h-12 rounded-full bg-[#1F65A6] border-2 border-[#1F65A6] flex justify-center items-center">  
              <TextMd className="text-white">4</TextMd>  
            </Link>
            
          </div> 
          <div className="h-[5%] flex items-center pl-15">
            <Link href={"/tutee-form/tutee-form3"}>
              <Image 
                src="/assets/Arrow.png"
                alt="Tutee Form"
                width={30}
                height={0}
              />
            </Link>
          </div>
          <div className="h-[80%] flex flex-col justify-center items-center space-y-8">  
            <h1 className="font-normal text-[3rem]">What is your budget?</h1>  
            
            <div className="w-[80%]max-w-[600px] relative flex justify-center items-center">   
              <div className="w-[500px] p-8">  
                <div className="relative w-full pb-6">  
                  {/* Extreme Value Labels */}  
                  <div className="absolute left-0 bottom-0 text-sm text-gray-500">0</div>  
                  <div className="absolute right-0 bottom-0 text-sm text-gray-500">300,000</div>  

                  {/* Slider Container */}  
                  <div className="relative w-full h-12">  
                    {/* Min Value Label */}  
                    <div   
                      className="absolute text-sm font-semibold text-gray-700"  
                      style={{   
                        left: `${(minValue / maxLimit) * 100}%`,   
                        transform: 'translateX(-50%)',  
                        top: '-25px'  
                      }}  
                    >  
                      {minValue.toLocaleString()}  
                    </div>  

                    {/* Max Value Label */}  
                    <div   
                      className="absolute text-sm font-semibold text-gray-700"  
                      style={{   
                        left: `${(maxValue / maxLimit) * 100}%`,   
                        transform: 'translateX(-50%)',  
                        top: '-25px'  
                      }}  
                    >  
                      {maxValue.toLocaleString()}  
                    </div>  

                    {/* Slider Track */}  
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-300 rounded-full overflow-hidden">  
                      <div   
                        ref={sliderProgressRef}  
                        className="absolute h-full bg-orange-500 rounded-full"  
                      >  
                      </div>  
                    </div>  
                    
                    {/* Slider Inputs */}  
                    <input   
                      onChange={handleRangeInput}   
                      ref={minRangeRef}  
                      type="range"   
                      min={minLimit}   
                      max={maxLimit}   
                      value={minValue}   
                      step={1000}  
                      className="range-min absolute w-full top-1/2 -translate-y-2 z-10 appearance-none bg-transparent   
                        [&::-webkit-slider-thumb]:appearance-none  
                        [&::-webkit-slider-thumb]:w-[20px]  
                        [&::-webkit-slider-thumb]:h-[20px]  
                        [&::-webkit-slider-thumb]:bg-white  
                        [&::-webkit-slider-thumb]:rounded-full  
                        [&::-webkit-slider-thumb]:border-[3px]  
                        [&::-webkit-slider-thumb]:border-orange-500  
                        [&::-webkit-slider-thumb]:cursor-pointer  
                        [&::-webkit-slider-thumb]:shadow-md  
                        [&::-webkit-slider-runnable-track]:h-0  
                        [&::-moz-range-thumb]:w-[20px]  
                        [&::-moz-range-thumb]:h-[20px]  
                        [&::-moz-range-thumb]:bg-white  
                        [&::-moz-range-thumb]:rounded-full  
                        [&::-moz-range-thumb]:border-[3px]  
                        [&::-moz-range-thumb]:border-orange-500  
                        [&::-moz-range-thumb]:cursor-pointer  
                        [&::-moz-range-thumb]:shadow-md"  
                    />  
                    <input   
                      onChange={handleRangeInput}   
                      ref={maxRangeRef}  
                      type="range"   
                      min={minLimit}   
                      max={maxLimit}   
                      value={maxValue}   
                      step={1000}  
                      className="range-max absolute w-full top-1/2 -translate-y-2 z-10 appearance-none bg-transparent   
                        [&::-webkit-slider-thumb]:appearance-none  
                        [&::-webkit-slider-thumb]:w-[20px]  
                        [&::-webkit-slider-thumb]:h-[20px]  
                        [&::-webkit-slider-thumb]:bg-white  
                        [&::-webkit-slider-thumb]:rounded-full  
                        [&::-webkit-slider-thumb]:border-[3px]  
                        [&::-webkit-slider-thumb]:border-orange-500  
                        [&::-webkit-slider-thumb]:cursor-pointer  
                        [&::-webkit-slider-thumb]:shadow-md  
                        [&::-webkit-slider-runnable-track]:h-0  
                        [&::-moz-range-thumb]:w-[20px]  
                        [&::-moz-range-thumb]:h-[20px]  
                        [&::-moz-range-thumb]:bg-white  
                        [&::-moz-range-thumb]:rounded-full  
                        [&::-moz-range-thumb]:border-[3px]  
                        [&::-moz-range-thumb]:border-orange-500  
                        [&::-moz-range-thumb]:cursor-pointer  
                        [&::-moz-range-thumb]:shadow-md"  
                    />  
                  </div>  
                </div>  
              </div>  
            </div>   
            
            {/* Continue Button */}  
            <div   
              onClick={handleSubmit}  
              className="w-[40%] bg-[#1F65A6] rounded-xl p-3 flex justify-center items-center cursor-pointer"  
            >  
              <TextMd className="text-white">Continue</TextMd>  
            </div>  
          </div>
        </div>
      </div>  
    </div>  
  );   
}
