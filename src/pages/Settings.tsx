import { useState } from "react";
import { Save, RefreshCw, Wifi, Clock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SettingsState {
  loginStartTime: string;
  loginEndTime: string;
  logoutStartTime: string;
  logoutEndTime: string;
  autoSync: boolean;
  syncInterval: number;
  googleSheetsConnected: boolean;
  sheetsId: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    loginStartTime: "09:00",
    loginEndTime: "09:45",
    logoutStartTime: "16:25",
    logoutEndTime: "16:45",
    autoSync: true,
    syncInterval: 1,
    googleSheetsConnected: true,
    sheetsId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    
    // Simulate sync with Google Sheets
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSyncing(false);
    toast({
      title: "Data Synced",
      description: "Successfully synced with Google Sheets.",
    });
  };

  const handleConnectSheets = () => {
    // In a real app, this would open Google OAuth flow
    setSettings(prev => ({ ...prev, googleSheetsConnected: !prev.googleSheetsConnected }));
    toast({
      title: settings.googleSheetsConnected ? "Disconnected" : "Connected",
      description: settings.googleSheetsConnected 
        ? "Disconnected from Google Sheets" 
        : "Successfully connected to Google Sheets",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your attendance system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Windows */}
        <Card className="gradient-card shadow-custom border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Time Windows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Time */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Login Time Window</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loginStart" className="text-xs text-muted-foreground">
                    Start Time
                  </Label>
                  <Input
                    id="loginStart"
                    type="time"
                    value={settings.loginStartTime}
                    onChange={(e) => handleSettingChange("loginStartTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginEnd" className="text-xs text-muted-foreground">
                    End Time (Late After)
                  </Label>
                  <Input
                    id="loginEnd"
                    type="time"
                    value={settings.loginEndTime}
                    onChange={(e) => handleSettingChange("loginEndTime", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Logout Time */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Logout Time Window</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoutStart" className="text-xs text-muted-foreground">
                    Earliest Time
                  </Label>
                  <Input
                    id="logoutStart"
                    type="time"
                    value={settings.logoutStartTime}
                    onChange={(e) => handleSettingChange("logoutStartTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoutEnd" className="text-xs text-muted-foreground">
                    Latest Time
                  </Label>
                  <Input
                    id="logoutEnd"
                    type="time"
                    value={settings.logoutEndTime}
                    onChange={(e) => handleSettingChange("logoutEndTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Sheets Integration */}
        <Card className="gradient-card shadow-custom border-0 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Google Sheets Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Connection Status</Label>
                <p className="text-xs text-muted-foreground">
                  Google Sheets API connection
                </p>
              </div>
              <Badge
                variant={settings.googleSheetsConnected ? "default" : "destructive"}
                className={
                  settings.googleSheetsConnected
                    ? "bg-success text-success-foreground"
                    : ""
                }
              >
                <Wifi className="h-3 w-3 mr-1" />
                {settings.googleSheetsConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {/* Sheets ID */}
            <div className="space-y-2">
              <Label htmlFor="sheetsId" className="text-sm font-medium">
                Google Sheets ID
              </Label>
              <Input
                id="sheetsId"
                placeholder="Enter your Google Sheets ID"
                value={settings.sheetsId}
                onChange={(e) => handleSettingChange("sheetsId", e.target.value)}
                disabled={!settings.googleSheetsConnected}
              />
            </div>

            {/* Auto Sync */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Sync</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync data every {settings.syncInterval} minute(s)
                </p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange("autoSync", checked)}
              />
            </div>

            {/* Sync Interval */}
            {settings.autoSync && (
              <div className="space-y-2">
                <Label htmlFor="syncInterval" className="text-sm font-medium">
                  Sync Interval (minutes)
                </Label>
                <Input
                  id="syncInterval"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.syncInterval}
                  onChange={(e) => handleSettingChange("syncInterval", parseInt(e.target.value))}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleConnectSheets}
                variant={settings.googleSheetsConnected ? "destructive" : "default"}
                className={!settings.googleSheetsConnected ? "gradient-primary" : ""}
              >
                {settings.googleSheetsConnected ? "Disconnect" : "Connect Google Sheets"}
              </Button>
              
              {settings.googleSheetsConnected && (
                <Button
                  onClick={handleSyncNow}
                  variant="outline"
                  disabled={isSyncing}
                  className="w-full"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="gradient-primary shadow-primary"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}