import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  
  const [profile, setProfile] = useState({
    fullName: "Mayuresh Patil",
    gender: "Male",
    dob: "1998-05-15",
    pan: "ABCDE1234F",
    mobile: "+91 9876543210",
    email: "mayuresh@prostock.com",
    ckyc: "XXXXXXXXXXXXXX",
    incomeRange: "₹5L - ₹10L",
    depository: "CDSL",
    exchanges: {
      BSE: true,
      NSE: true,
      MCX: false,
      NCDEX: false,
      ICEX: false,
    },
  });

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Photo Updated",
        description: "Profile photo uploaded successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Profile on ProStock
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo */}
          <Card className="lg:col-span-1 bg-card border-border shadow-elegant h-fit">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {profile.fullName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{profile.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details */}
            <Card className="bg-card border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dob}
                      onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan">PAN</Label>
                    <Input
                      id="pan"
                      value={profile.pan}
                      onChange={(e) => setProfile({ ...profile, pan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={profile.mobile}
                      onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ckyc">CKYC No.</Label>
                    <Input
                      id="ckyc"
                      value={profile.ckyc}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="income">Income Range</Label>
                    <Input
                      id="income"
                      value={profile.incomeRange}
                      onChange={(e) => setProfile({ ...profile, incomeRange: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="bg-card border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Depository</Label>
                  <Input value={profile.depository} disabled className="bg-muted" />
                </div>
                
                <div>
                  <Label className="mb-3 block">Exchanges</Label>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(profile.exchanges).map(([exchange, enabled]) => (
                      <div key={exchange} className="flex items-center gap-2">
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            setProfile({
                              ...profile,
                              exchanges: { ...profile.exchanges, [exchange]: checked },
                            })
                          }
                        />
                        <Label className="cursor-pointer">{exchange}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="bg-card border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDark ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        {isDark ? "Dark Mode" : "Light Mode"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full gradient-primary">
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
