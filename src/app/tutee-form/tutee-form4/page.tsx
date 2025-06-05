"use client";

import { TextMd } from "@/components/Text";
import React, { useState, useRef, useEffect } from 'react';  
import Image from "next/image";
import Link from "next/link";
import { useTuteeForm } from "@/contexts/TuteeFormContext";
// import { useRouter } from "next/navigation";

export default function TuteeForm4() {
  const { formData, updateFormData } = useTuteeForm();  
  // const router = useRouter();  

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
  
      // Log the raw response for debugging  
      console.log('Response status:', response.status);  
      console.log('Response headers:', Object.fromEntries(response.headers.entries())); 
  
      if (!response.ok) {  
        const errorText = await response.text();  
        console.error('Error response text:', errorText);  
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);  
      }  
  
      // Try to parse JSON with error handling  
      try {  
        const responseData = await response.json();  
        console.log('Server Response:', responseData);  
        // router.push('/');  
      } catch (jsonError) {  
        console.error('JSON parsing error:', jsonError);  
        throw new Error('Failed to parse server response');  
      }  
    } catch (error) {  
      console.error('Submission error:', error);  
      
      // Optional: Show user-friendly error message  
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
    <div className="min-h-screen w-full flex">  
      <div className="hidden sm:flex w-[30%] bg-[#FFFFFF] p-4 items-center justify-center">  
        <Image 
          src="/assets/TuteeFormPage4.png"
          alt="Tutee Form"
          width={500}
          height={0}
          className="max-w-full h-auto"
        />
      </div>
      <div className="w-full sm:w-[70%] bg-[#F0FAF9] min-h-screen">
        <div className="min-h-screen w-full flex flex-col">  
          <div className="flex-shrink-0 py-6 sm:py-8 flex justify-center items-center px-4">  
            <div className="flex items-center max-w-full overflow-x-auto">
              <Link href="/tutee-form" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center flex-shrink-0">  
                <Image 
                  src="/assets/CheckList.png"
                  alt="done"
                  width={12}
                  height={0}
                  className="sm:w-[15px]"
                />
              </Link> 

              <div className="w-4 sm:w-8 border-t border-[#1F65A6] flex-shrink-0"></div>  
              
              <Link href="/tutee-form/tutee-form2" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center flex-shrink-0">  
                <Image 
                  src="/assets/CheckList.png"
                  alt="done"
                  width={12}
                  height={0}
                  className="sm:w-[15px]"
                />
              </Link>
              
              <div className="w-4 sm:w-8 border-t border-[#1F65A6] flex-shrink-0"></div>   
              <Link href="/tutee-form/tutee-form3" className="w-12 h-12 rounded-full bg-white border-2 border-[#1F65A6] flex justify-center items-center flex-shrink-0">  
                <Image 
                  src="/assets/CheckList.png"
                  alt="done"
                  width={12}
                  height={0}
                  className="sm:w-[15px]"
                />
              </Link>
              
              <div className="w-4 sm:w-8 border-t border-[#1F65A6] flex-shrink-0"></div>  
              <Link href="/tutee-form/tutee-form4" className="w-12 h-12 rounded-full bg-[#1F65A6] border-2 border-[#1F65A6] flex justify-center items-center flex-shrink-0">  
                <TextMd className="text-white text-sm sm:text-base">4</TextMd>  
              </Link>
            </div>
          </div> 

          {/* Back Arrow */}
          <div className="flex-shrink-0 pb-4 flex items-center pl-4 sm:pl-8">
            <Link href={"/tutee-form/tutee-form3"}>
              <Image 
                src="/assets/Arrow.png"
                alt="Tutee Form"
                width={24}
                height={0}
                className="sm:w-[30px]"
              />
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-8 space-y-8 sm:space-y-10">  
            <h1 className="font-normal text-center text-[1.5rem] sm:text-[2rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem]">
              What is your budget?
            </h1>  
            
            <div className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] flex justify-center items-center">   
              <div className="w-full px-4 sm:px-8">  
                <div className="relative w-full pb-6">  
                  {/* Extreme Value Labels */}  
                  <div className="absolute left-0 bottom-0 text-xs sm:text-sm text-gray-500">0</div>  
                  <div className="absolute right-0 bottom-0 text-xs sm:text-sm text-gray-500">300,000</div>  

                  {/* Slider Container */}  
                  <div className="relative w-full h-16">  
                    {/* Min Value Label */}  
                    <div   
                      className="absolute text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap"  
                      style={{   
                        left: `${(minValue / maxLimit) * 100}%`,   
                        transform: 'translateX(-50%)',  
                        top: '-30px'  
                      }}  
                    >  
                      {minValue.toLocaleString()}  
                    </div>  

                    {/* Max Value Label */}  
                    <div   
                      className="absolute text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap"  
                      style={{   
                        left: `${(maxValue / maxLimit) * 100}%`,   
                        transform: 'translateX(-50%)',  
                        top: '-30px'  
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
                        [&::-webkit-slider-thumb]:w-[18px]  
                        [&::-webkit-slider-thumb]:h-[18px]  
                        sm:[&::-webkit-slider-thumb]:w-[20px]  
                        sm:[&::-webkit-slider-thumb]:h-[20px]  
                        [&::-webkit-slider-thumb]:bg-white  
                        [&::-webkit-slider-thumb]:rounded-full  
                        [&::-webkit-slider-thumb]:border-[3px]  
                        [&::-webkit-slider-thumb]:border-orange-500  
                        [&::-webkit-slider-thumb]:cursor-pointer  
                        [&::-webkit-slider-thumb]:shadow-md  
                        [&::-webkit-slider-runnable-track]:h-0  
                        [&::-moz-range-thumb]:w-[18px]  
                        [&::-moz-range-thumb]:h-[18px]  
                        sm:[&::-moz-range-thumb]:w-[20px]  
                        sm:[&::-moz-range-thumb]:h-[20px]  
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
                        [&::-webkit-slider-thumb]:w-[18px]  
                        [&::-webkit-slider-thumb]:h-[18px]  
                        sm:[&::-webkit-slider-thumb]:w-[20px]  
                        sm:[&::-webkit-slider-thumb]:h-[20px]  
                        [&::-webkit-slider-thumb]:bg-white  
                        [&::-webkit-slider-thumb]:rounded-full  
                        [&::-webkit-slider-thumb]:border-[3px]  
                        [&::-webkit-slider-thumb]:border-orange-500  
                        [&::-webkit-slider-thumb]:cursor-pointer  
                        [&::-webkit-slider-thumb]:shadow-md  
                        [&::-webkit-slider-runnable-track]:h-0  
                        [&::-moz-range-thumb]:w-[18px]  
                        [&::-moz-range-thumb]:h-[18px]  
                        sm:[&::-moz-range-thumb]:w-[20px]  
                        sm:[&::-moz-range-thumb]:h-[20px]  
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
              className="w-full max-w-[300px] sm:w-[40%] bg-[#1F65A6] rounded-xl p-3 sm:p-4 flex justify-center items-center cursor-pointer transition-colors hover:bg-[#1a5690]"  
            >  
              <TextMd className="text-white">Continue</TextMd>  
            </div>  
          </div>
        </div>
      </div>  
    </div>  
  );   
}