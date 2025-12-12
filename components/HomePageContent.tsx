"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CloudinaryImageUpload } from "@/components/CloudinaryImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Reusing styles from page.tsx (duplicated here to be independent)
const inputClasses =
  "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
const labelClasses = "text-gray-700 dark:text-gray-300 font-medium";

const HeroForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    title: "",
    subtitle: "",
    description: "",
    backgroundImage: "",
    buttonText: "",
    buttonLink: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          title: data.data.title || "",
          subtitle: data.data.subtitle || "",
          description: data.data.description || "",
          backgroundImage: data.data.backgroundImage || "",
          buttonText: data.data.buttonText || "",
          buttonLink: data.data.buttonLink || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch hero data", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ হিরো সেকশন সফলভাবে আপডেট হয়েছে!");
      } else {
        toast.error("❌ হিরো সেকশন আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      toast.error("❌ একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        হিরো সেকশন সম্পাদনা
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className={labelClasses}>
              শিরোনাম
            </Label>
            <Input
              id="title"
              value={params.title}
              onChange={handleChange}
              placeholder="Ex: আন্তর্জাতিক হিফজ শিক্ষা প্রতিষ্ঠান..."
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className={labelClasses}>
              সাবটাইটেল (Optional)
            </Label>
            <Input
              id="subtitle"
              value={params.subtitle}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={labelClasses}>
              বর্ণনা
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={params.description}
              onChange={handleChange}
              placeholder="Ex: মারকাজুত তাহফিজ ইন্টারন্যাশনাল মাদ্রাসা বিশ্বের অন্যতম..."
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonText" className={labelClasses}>
              বাটন টেক্সট
            </Label>
            <Input
              id="buttonText"
              value={params.buttonText}
              onChange={handleChange}
              placeholder="Ex: আমাদের সম্পর্কে"
              className={inputClasses}
            />
          </div>

          <CloudinaryImageUpload
            label="ব্যাকগ্রাউন্ড ইমেজ"
            folder="markazut-tahfiz/hero"
            value={params.backgroundImage}
            onChange={(url: string) =>
              setParams((prev) => ({ ...prev, backgroundImage: url }))
            }
            uploadToCloudinary={uploadToCloudinary}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "সেভ করুন"}
        </Button>
      </form>
    </div>
  );
};

const AboutForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    title: "",
    description: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    steps: [
      { number: "01", title: "আধুনিক ক্যাম্পাস", icon: "School" },
      { number: "02", title: "অভিজ্ঞ ওস্তাদ", icon: "NotebookPen" },
      { number: "03", title: "দক্ষ ব্যবস্থাপনা", icon: "MonitorCog" },
      { number: "04", title: "আধুনিক পাঠ্যক্রম", icon: "BookOpenText" },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/about");
      
      // Check if response is OK
      if (!res.ok) {
        console.error("Failed to fetch about data: HTTP", res.status);
        toast.error("❌ তথ্য লোড করতে সমস্যা হয়েছে");
        return;
      }
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);
        const text = await res.text();
        console.error("Response body:", text.substring(0, 200));
        toast.error("❌ সার্ভার সমস্যা - দয়া করে আবার চেষ্টা করুন");
        return;
      }
      
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          title: data.data.title || "",
          description: data.data.description || "",
          image1: data.data.image1 || "",
          image2: data.data.image2 || "",
          image3: data.data.image3 || "",
          image4: data.data.image4 || "",
          steps: data.data.steps && data.data.steps.length > 0 ? data.data.steps : [
            { number: "01", title: "আধুনিক ক্যাম্পাস", icon: "School" },
            { number: "02", title: "অভিজ্ঞ ওস্তাদ", icon: "NotebookPen" },
            { number: "03", title: "দক্ষ ব্যবস্থাপনা", icon: "MonitorCog" },
            { number: "04", title: "আধুনিক পাঠ্যক্রম", icon: "BookOpenText" },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch about data", error);
      toast.error("❌ ডেটা লোড করতে ব্যর্থ হয়েছে");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...params.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setParams((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ আমাদের সেবা সেকশন সফলভাবে আপডেট হয়েছে!");
      } else {
        toast.error("❌ আমাদের সেবা সেকশন আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      toast.error("❌ একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        আমাদের সেবা সেকশন
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Steps Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">ধাপসমূহ (Steps)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {params.steps.map((step, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                 <div className="flex gap-4">
                    <div className="w-1/3">
                      <Label className={labelClasses}>নম্বর</Label>
                      <Input
                        value={step.number}
                        onChange={(e) => handleStepChange(index, "number", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                     <div className="w-2/3">
                      <Label className={labelClasses}>আইকন</Label>
                       <Select 
                          value={step.icon} 
                          onValueChange={(value) => handleStepChange(index, "icon", value)}
                        >
                          <SelectTrigger className={inputClasses}>
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="School">School</SelectItem>
                            <SelectItem value="NotebookPen">NotebookPen</SelectItem>
                            <SelectItem value="MonitorCog">MonitorCog</SelectItem>
                            <SelectItem value="BookOpenText">BookOpenText</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="ArrowRight">ArrowRight</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div>
                    <Label className={labelClasses}>শিরোনাম</Label>
                    <Input
                      value={step.title}
                      onChange={(e) => handleStepChange(index, "title", e.target.value)}
                      className={inputClasses}
                    />
                 </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className={labelClasses}>
              টাইটেল
            </Label>
            <Input
              id="title"
              value={params.title}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={labelClasses}>
              মূল কনটেন্ট
            </Label>
            <Textarea
              id="description"
              rows={6}
              value={params.description}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CloudinaryImageUpload
              label="ইমেজ ১"
              folder="markazut-tahfiz/about"
              value={params.image1}
              onChange={(url: string) =>
                setParams((prev) => ({ ...prev, image1: url }))
              }
              uploadToCloudinary={uploadToCloudinary}
            />

            <CloudinaryImageUpload
              label="ইমেজ ২"
              folder="markazut-tahfiz/about"
              value={params.image2}
              onChange={(url: string) =>
                setParams((prev) => ({ ...prev, image2: url }))
              }
              uploadToCloudinary={uploadToCloudinary}
            />

            <CloudinaryImageUpload
              label="ইমেজ ৩"
              folder="markazut-tahfiz/about"
              value={params.image3}
              onChange={(url: string) =>
                setParams((prev) => ({ ...prev, image3: url }))
              }
              uploadToCloudinary={uploadToCloudinary}
            />

            <CloudinaryImageUpload
              label="ইমেজ ৪"
              folder="markazut-tahfiz/about"
              value={params.image4}
              onChange={(url: string) =>
                setParams((prev) => ({ ...prev, image4: url }))
              }
              uploadToCloudinary={uploadToCloudinary}
            />
          </div>
        </div>

       

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "সেভ করুন"}
        </Button>
      </form>
    </div>
  );
};


const SpeechForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    name: "",
    role: "",
    message: "",
    image: "",
    subtitle: "মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা",
    arabic: "بسم الله الرحمن الرحيم",
    bengaliGreeting: "আলাহামদুলিল্লাহ",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpeech();
  }, []);

  const fetchSpeech = async () => {
    try {
      const res = await fetch("/api/speech");
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          name: data.data.name || "",
          role: data.data.role || "",
          message: data.data.message || "",
          image: data.data.image || "",
          subtitle: data.data.subtitle || "মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা",
          arabic: data.data.arabic || "بسم الله الرحمن الرحيم",
          bengaliGreeting: data.data.bengaliGreeting || "আলাহামদুলিল্লাহ",
        });
      }
    } catch (error) {
      console.error("Failed to fetch speech data", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ বাণী সেকশন সফলভাবে আপডেট হয়েছে!");
      } else {
        toast.error("❌ বাণী সেকশন আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      toast.error("❌ একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        বাণী
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className={labelClasses}>
                নাম
              </Label>
              <Input
                id="name"
                value={params.name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className={labelClasses}>
                পদবী
              </Label>
              <Input
                id="role"
                value={params.role}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle" className={labelClasses}>
                প্রতিষ্ঠান (Subtitle)
              </Label>
              <Input
                id="subtitle"
                value={params.subtitle}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arabic" className={labelClasses}>
                আরবি হেডিং (Arabic)
              </Label>
              <Input
                id="arabic"
                value={params.arabic}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bengaliGreeting" className={labelClasses}>
              শুভেচ্ছা বার্তা (Greeting)
            </Label>
            <Input
              id="bengaliGreeting"
              value={params.bengaliGreeting}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className={labelClasses}>
              বাণী টেক্সট
            </Label>
            <Textarea
              id="message"
              rows={6}
              value={params.message}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <CloudinaryImageUpload
            label="প্রোফাইল ইমেজ"
            folder="markazut-tahfiz/speech"
            value={params.image}
            onChange={(url: string) =>
              setParams((prev) => ({ ...prev, image: url }))
            }
            uploadToCloudinary={uploadToCloudinary}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "সেভ করুন"}
        </Button>
      </form>
    </div>
  );
};

const InfoForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    info1Quantity: 50,
    info1Title: "+ অভিজ্ঞ উস্তাদ ",
    info2Quantity: 20,
    info2Title: "কর্মচারী",
    info3Quantity: 300,
    info3Title: "বালক",
    info4Quantity: 100,
    info4Title: "বালিকা",
    backgroundImage: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await fetch("/api/info");
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          info1Quantity: data.data.info1Quantity || 50,
          info1Title: data.data.info1Title || "+ অভিজ্ঞ উস্তাদ ",
          info2Quantity: data.data.info2Quantity || 20,
          info2Title: data.data.info2Title || "কর্মচারী",
          info3Quantity: data.data.info3Quantity || 300,
          info3Title: data.data.info3Title || "বালক",
          info4Quantity: data.data.info4Quantity || 100,
          info4Title: data.data.info4Title || "বালিকা",
          backgroundImage: data.data.backgroundImage || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch info data", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    // Handle number inputs
    if (id.includes("Quantity")) {
      setParams((prev) => ({ ...prev, [id]: parseInt(value) || 0 }));
    } else {
      setParams((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ তথ্য কাউন্টার সফলভাবে আপডেট হয়েছে!");
      } else {
        toast.error("❌ তথ্য কাউন্টার আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      toast.error("❌ একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        তথ্য কাউন্টার (Information Counter)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Background Image Upload */}
        <CloudinaryImageUpload
            label="ব্যাকগ্রাউন্ড ইমেজ"
            folder="markazut-tahfiz/info"
            value={params.backgroundImage}
            onChange={(url: string) =>
              setParams((prev) => ({ ...prev, backgroundImage: url }))
            }
            uploadToCloudinary={uploadToCloudinary}
          />
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Info Box 1 */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              তথ্য বক্স ১ (Info Box 1)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info1Quantity" className={labelClasses}>
                  সংখ্যা (Quantity)
                </Label>
                <Input
                  id="info1Quantity"
                  type="number"
                  value={params.info1Quantity}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info1Title" className={labelClasses}>
                  টাইটেল (Title)
                </Label>
                <Input
                  id="info1Title"
                  value={params.info1Title}
                  onChange={handleChange}
                  placeholder="Ex: + অভিজ্ঞ উস্তাদ"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Info Box 2 */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              তথ্য বক্স ২ (Info Box 2)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info2Quantity" className={labelClasses}>
                  সংখ্যা (Quantity)
                </Label>
                <Input
                  id="info2Quantity"
                  type="number"
                  value={params.info2Quantity}
                  onChange={handleChange}
                  placeholder="Ex: 20"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info2Title" className={labelClasses}>
                  টাইটেল (Title)
                </Label>
                <Input
                  id="info2Title"
                  value={params.info2Title}
                  onChange={handleChange}
                  placeholder="Ex: কর্মচারী"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Info Box 3 */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              তথ্য বক্স ৩ (Info Box 3)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info3Quantity" className={labelClasses}>
                  সংখ্যা (Quantity)
                </Label>
                <Input
                  id="info3Quantity"
                  type="number"
                  value={params.info3Quantity}
                  onChange={handleChange}
                  placeholder="Ex: 300"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info3Title" className={labelClasses}>
                  টাইটেল (Title)
                </Label>
                <Input
                  id="info3Title"
                  value={params.info3Title}
                  onChange={handleChange}
                  placeholder="Ex: বালক"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Info Box 4 */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              তথ্য বক্স ৪ (Info Box 4)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info4Quantity" className={labelClasses}>
                  সংখ্যা (Quantity)
                </Label>
                <Input
                  id="info4Quantity"
                  type="number"
                  value={params.info4Quantity}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="info4Title" className={labelClasses}>
                  টাইটেল (Title)
                </Label>
                <Input
                  id="info4Title"
                  value={params.info4Title}
                  onChange={handleChange}
                  placeholder="Ex: বালিকা"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "সেভ করুন"}
        </Button>
      </form>
    </div>
  );
}

const GalleryForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  interface GalleryImage {
    _id?: string;
    tempId?: string;
    imageUrl: string;
    title?: string;
    category?: string;
  }

  const [images, setImages] = useState<GalleryImage[]>([]);
  // Track multiple processing items using their IDs
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.data) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery data", error);
    }
  };

  const isProcessing = (id: string | undefined) => {
    if (!id) return false;
    return processingItems.has(id);
  };

  const addToProcessing = (id: string) => {
    setProcessingItems((prev) => new Set(prev).add(id));
  };

  const removeFromProcessing = (id: string) => {
    setProcessingItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      tempId: Date.now().toString(),
      imageUrl: "",
      title: "",
      category: "General",
    };
    setImages([...images, newImage]);
  };

  const handleRemoveImage = async (image: GalleryImage) => {
    const id = image._id || image.tempId;
    if (!id || isProcessing(id)) return;

    if (image._id) {
      addToProcessing(id);
      try {
        const res = await fetch(`/api/gallery/${image._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success("✅ ছবি সফলভাবে মুছে ফেলা হয়েছে!");
          setImages((prev) => prev.filter((img) => img._id !== image._id));
        } else {
          // If 404, it's already gone, so remove locally
          if (res.status === 404 || data.message === "Image not found") {
            setImages((prev) => prev.filter((img) => img._id !== image._id));
            toast.error("❌ ছবি ইতিমধ্যে মুছে ফেলা হয়েছে (Local sync)");
          } else {
            toast.error("❌ ছবি মুছতে ব্যর্থ হয়েছে: " + (data.message || "Unknown error"));
          }
        }
      } catch (error: any) {
        toast.error("❌ একটি সমস্যা হয়েছে: " + error.message);
      } finally {
        removeFromProcessing(id);
      }
    } else {
      // Unsaved image, just remove locally
      setImages((prev) =>
        prev.filter((img) =>
          img.tempId ? img.tempId !== image.tempId : img !== image
        )
      );
    }
  };

  const handleImageChange = (index: number, url: string) => {
    const updatedImages = [...images];
    updatedImages[index].imageUrl = url;
    setImages(updatedImages);
  };

  const handleTitleChange = (index: number, title: string) => {
    const updatedImages = [...images];
    updatedImages[index].title = title;
    setImages(updatedImages);
  };

  const handleSaveImage = async (index: number) => {
    const image = images[index];
    const id = image._id || image.tempId;

    if (!id || !image.imageUrl) {
      toast.error("❌ অনুগ্রহ করে ছবি আপলোড করুন");
      return;
    }
    
    if (isProcessing(id)) return;

    addToProcessing(id);
    try {
      if (image._id) {
        // Update existing
        const res = await fetch(`/api/gallery/${image._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: image.imageUrl,
            title: image.title,
            category: image.category,
          }),
        });
        const data = await res.json();

        if (data.success) {
          toast.success("✅ ছবি আপডেট হয়েছে!");
          // Update local state details if needed
          setImages((prev) => {
             const copy = [...prev];
             copy[index] = data.data;
             return copy;
          });
        } else {
          toast.error("❌ আপডেট ব্যর্থ: " + (data.message || "Unknown error"));
        }
      } else {
        // Create new
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: image.imageUrl,
            title: image.title,
            category: image.category,
          }),
        });
        const data = await res.json();

        if (data.success) {
          toast.success("✅ সফলভাবে সংরক্ষিত হয়েছে!");
          // IMPORTANT: Update the local item with the real _id from server immediately
          setImages((prev) => {
            const copy = [...prev];
            // Find the item by index (safest for direct action) or tempId
            // Since we blocked the UI for this item, index should be stable enough relative to this item's context
            if (copy[index]) {
               copy[index] = data.data; // Replace tempId item with real DB item
            }
            return copy;
          });
        } else {
          toast.error("❌ সংরক্ষণ ব্যর্থ: " + (data.message || "Unknown error"));
        }
      }
    } catch (error: any) {
      toast.error("❌ সমস্যা হয়েছে: " + error.message);
    } finally {
      removeFromProcessing(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          গ্যালারি ম্যানেজমেন্ট
        </h2>
        <Button
          type="button"
          onClick={handleAddImage}
          variant="outline"
          className="bg-green-500 text-white hover:bg-green-600"
        >
          + নতুন ছবি যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const currentId = image._id || image.tempId;
          const loading = isProcessing(currentId);

          return (
            <div
              key={currentId || index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ছবি #{index + 1}
                </h3>
                <Button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  disabled={loading}
                >
                   {loading ? "..." : "🗑️ মুছুন"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label className={labelClasses}>টাইটেল (ঐচ্ছিক)</Label>
                <Input
                  type="text"
                  value={image.title || ""}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder="ছবির বর্ণনা..."
                  className={inputClasses}
                  disabled={loading}
                />
              </div>

              <CloudinaryImageUpload
                label="ছবি আপলোড করুন"
                folder="markazut-tahfiz/gallery"
                value={image.imageUrl}
                onChange={(url: string) => handleImageChange(index, url)}
                uploadToCloudinary={uploadToCloudinary}
              />

              <Button
                type="button"
                onClick={() => handleSaveImage(index)}
                disabled={loading || !image.imageUrl}
                className="w-full"
              >
                {loading
                  ? "সংরক্ষণ হচ্ছে..."
                  : image._id
                  ? "আপডেট করুন"
                  : "সেভ করুন"}
              </Button>
            </div>
          );
        })}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">কোন ছবি নেই।</p>
          <p className="text-sm mt-2">
            উপরের "+ নতুন ছবি যোগ করুন" বাটনে ক্লিক করে শুরু করুন।
          </p>
        </div>
      )}
    </div>
  );
};

const TestimonialForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  interface TestimonialItem {
    _id?: string;
    tempId?: string;
    name: string;
    location: string;
    message: string;
    image: string;
    rating?: number;
  }

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  // Track multiple processing items using their IDs
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Use no-store to avoid stale data
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonial data", error);
    }
  };

  const isProcessing = (id: string | undefined) => {
    if (!id) return false;
    return processingItems.has(id);
  };

  const addToProcessing = (id: string) => {
    setProcessingItems((prev) => new Set(prev).add(id));
  };

  const removeFromProcessing = (id: string) => {
    setProcessingItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAddItem = () => {
    const newItem: TestimonialItem = {
      tempId: Date.now().toString(),
      name: "",
      location: "",
      message: "",
      image: "",
      rating: 5,
    };
    setTestimonials([...testimonials, newItem]);
  };

  const handleRemoveItem = async (item: TestimonialItem) => {
    const id = item._id || item.tempId;
    if (!id || isProcessing(id)) return;

    if (item._id) {
      addToProcessing(id);
      try {
        const res = await fetch(`/api/testimonials/${item._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success("✅ প্রশংসাপত্র মুছে ফেলা হয়েছে!");
          setTestimonials((prev) => prev.filter((t) => t._id !== item._id));
        } else {
          if (res.status === 404) {
             setTestimonials((prev) => prev.filter((t) => t._id !== item._id));
             toast.error("❌ প্রশংসাপত্র ইতিমধ্যে মুছে ফেলা হয়েছে");
          } else {
             toast.error("❌ মুছতে ব্যর্থ: " + (data.message || "Unknown error"));
          }
        }
      } catch (error: any) {
        toast.error("❌ সমস্যা হয়েছে: " + error.message);
      } finally {
        removeFromProcessing(id);
      }
    } else {
      setTestimonials((prev) =>
        prev.filter((t) =>
          t.tempId ? t.tempId !== item.tempId : t !== item
        )
      );
    }
  };

  const handleChange = (index: number, field: keyof TestimonialItem, value: string | number) => {
    const updated = [...testimonials];
    // @ts-ignore
    updated[index][field] = value;
    setTestimonials(updated);
  };

  const handleSaveItem = async (index: number) => {
    const item = testimonials[index];
    const id = item._id || item.tempId;

    if (!id) return;
    if (!item.name || !item.message) {
      toast.error("❌ নাম এবং বাণী আবশ্যক");
      return;
    }
    
    if (isProcessing(id)) return;
    addToProcessing(id);

    try {
      const payload = {
        name: item.name,
        location: item.location,
        message: item.message,
        image: item.image,
        rating: item.rating || 5,
      };

      if (item._id) {
        // Update
        const res = await fetch(`/api/testimonials/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("✅ আপডেট হয়েছে!");
          setTestimonials((prev) => {
            const copy = [...prev];
            copy[index] = data.data;
            return copy;
          });
        } else {
          toast.error("❌ আপডেট ব্যর্থ: " + (data.message || "Error"));
        }
      } else {
        // Create
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("✅ নতুন প্রশংসাপত্র যুক্ত হয়েছে!");
          setTestimonials((prev) => {
            const copy = [...prev];
            copy[index] = data.data;
            return copy;
          });
        } else {
          toast.error("❌ যুক্ত করতে ব্যর্থ: " + (data.message || "Error"));
        }
      }
    } catch (error: any) {
      toast.error("❌ সমস্যা হয়েছে: " + error.message);
    } finally {
      removeFromProcessing(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
           প্রশংসা পত্র / সাহায্যকারীর বাণী
        </h2>
        <Button
          type="button"
          onClick={handleAddItem}
          variant="outline"
          className="bg-green-500 text-white hover:bg-green-600"
        >
          + নতুন যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {testimonials.map((item, index) => {
          const currentId = item._id || item.tempId;
          const loading = isProcessing(currentId);

          return (
            <div
              key={currentId || index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-6 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Testimonial #{index + 1}
                  </h3>
                  <Button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    {loading ? "..." : "🗑️ মুছুন"}
                  </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className={labelClasses}>নাম (Name)</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                      className={inputClasses}
                      placeholder="e.g. Al-Amin"
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className={labelClasses}>ঠিকানা (Location)</Label>
                        <Input
                        value={item.location}
                        onChange={(e) => handleChange(index, "location", e.target.value)}
                        className={inputClasses}
                        placeholder="Dhaka"
                        disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClasses}>রেটিং (1-5)</Label>
                        <Input
                        type="number"
                        min="1"
                        max="5"
                        value={item.rating || 5}
                        onChange={(e) => handleChange(index, "rating", parseInt(e.target.value))}
                        className={inputClasses}
                        disabled={loading}
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className={labelClasses}>বাণী (Message)</Label>
                    <Textarea
                      value={item.message}
                      onChange={(e) => handleChange(index, "message", e.target.value)}
                      className={inputClasses}
                      rows={3}
                      placeholder="লিখুন..."
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <CloudinaryImageUpload
                      label="ছবি (Image)"
                      folder="markazut-tahfiz/testimonial"
                      value={item.image}
                      onChange={(url) => handleChange(index, "image", url)}
                      uploadToCloudinary={uploadToCloudinary}
                   />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => handleSaveItem(index)}
                  disabled={loading}
                  className="w-full md:w-auto md:px-8"
                >
                  {loading 
                    ? "সংরক্ষণ হচ্ছে..." 
                    : item._id 
                    ? "আপডেট করুন" 
                    : "সেভ করুন"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
       
      {testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          কোনো প্রশংসাপত্র নেই
        </div>
      )}
    </div>
  );
};

const HomePageContent = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  return (
    <div className="space-y-6">
      <HeroForm uploadToCloudinary={uploadToCloudinary} />
      <AboutForm uploadToCloudinary={uploadToCloudinary} />
      <SpeechForm uploadToCloudinary={uploadToCloudinary} />
      <InfoForm uploadToCloudinary={uploadToCloudinary} />
      <GalleryForm uploadToCloudinary={uploadToCloudinary} />
      <TestimonialForm uploadToCloudinary={uploadToCloudinary} />
    </div>
  );
};

export default HomePageContent;