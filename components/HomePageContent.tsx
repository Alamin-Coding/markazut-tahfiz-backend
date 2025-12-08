"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CloudinaryImageUpload } from "@/components/CloudinaryImageUpload";

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
        toast.success("Hero section updated successfully");
      } else {
        toast.error("Failed to update hero section");
      }
    } catch (error) {
      toast.error("An error occurred");
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
        toast.error("Failed to load about data");
        return;
      }
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);
        const text = await res.text();
        console.error("Response body:", text.substring(0, 200));
        toast.error("Server error - please check console");
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
        });
      }
    } catch (error) {
      console.error("Failed to fetch about data", error);
      toast.error("Error loading data: " + String(error));
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
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("About section updated successfully");
      } else {
        toast.error("Failed to update about section");
      }
    } catch (error) {
      toast.error("An error occurred");
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
        toast.success("Speech section updated successfully");
      } else {
        toast.error("Failed to update speech section");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        প্রতিষ্ঠাতার বাণী সম্পাদনা
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

const GalleryForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          title: data.data.title || "",
          description: data.data.description || "",
          image: data.data.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch gallery data", error);
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
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Gallery section updated successfully");
      } else {
        toast.error("Failed to update gallery section");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        গ্যালারি সম্পাদনা
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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

          <CloudinaryImageUpload
            label="ইমেজ"
            folder="markazut-tahfiz/gallery"
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

const TestimonialForm = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  const [params, setParams] = useState({
    name: "",
    role: "",
    message: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async () => {
    try {
      const res = await fetch("/api/testimonial");
      const data = await res.json();
      if (data.success && data.data) {
        setParams({
          name: data.data.name || "",
          role: data.data.role || "",
          message: data.data.message || "",
          image: data.data.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch testimonial data", error);
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
      const res = await fetch("/api/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Testimonial section updated successfully");
      } else {
        toast.error("Failed to update testimonial section");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        সাহায্যকারীর বাণী সম্পাদনা
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
            folder="markazut-tahfiz/testimonial"
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

const HomePageContent = ({
  uploadToCloudinary,
}: {
  uploadToCloudinary: (file: File, folder?: string) => Promise<any>;
}) => {
  return (
    <div>
      <HeroForm uploadToCloudinary={uploadToCloudinary} />
      <AboutForm uploadToCloudinary={uploadToCloudinary} />
      <SpeechForm uploadToCloudinary={uploadToCloudinary} />
      <TestimonialForm uploadToCloudinary={uploadToCloudinary} />
      <GalleryForm uploadToCloudinary={uploadToCloudinary} />
    </div>
  );
};

export default HomePageContent;