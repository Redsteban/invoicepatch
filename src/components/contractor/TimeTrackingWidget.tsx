'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContractor } from '@/contexts/ContractorContext';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Camera, 
  Clock, 
  Calendar,
  Truck,
  AlertCircle,
  CheckCircle,
  Upload,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  Info,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  equipment?: string;
  photos: string[];
  notes: string;
  status: 'active' | 'completed' | 'break';
}

const TimeTrackingWidget = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<string>('Getting location...');
  const [equipment, setEquipment] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Simulation context
  const { 
    isSimulationMode, 
    simulationDay, 
    simulationData 
  } = useContractor();

  // Mock today's entries
  const [todaysEntries, setTodaysEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      startTime: '07:30',
      endTime: '12:00',
      location: {
        lat: 51.0447,
        lng: -114.0719,
        address: 'Calgary Downtown Tower - Site A'
      },
      equipment: 'Excavator 320D',
      photos: [],
      notes: 'Foundation work - east section',
      status: 'completed'
    }
  ]);

  // Simulation scenarios data
  const getSimulationScenario = () => {
    const scenarios = {
      1: {
        title: 'Standard Work Day',
        description: 'Regular 8-hour shift with standard equipment',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D',
        notes: 'Foundation work - east section',
        events: [],
        nextEvent: 'Equipment maintenance scheduled for tomorrow'
      },
      2: {
        title: 'Equipment Setup Day',
        description: 'Setting up new equipment and safety protocols',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Crane 150T + Safety Equipment',
        notes: 'Equipment setup and safety training',
        events: ['New safety protocols implemented'],
        nextEvent: 'Full production begins tomorrow'
      },
      3: {
        title: 'Overtime Equipment Day',
        description: 'Extended shift due to equipment maintenance requirements',
        hours: 10,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D + Backup Equipment',
        notes: 'Extended shift - equipment maintenance and foundation completion',
        events: ['Overtime approved', 'Equipment maintenance completed'],
        nextEvent: 'Rate increase notification expected'
      },
      4: {
        title: 'Standard Production Day',
        description: 'Normal production with updated safety protocols',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D',
        notes: 'Foundation work - west section',
        events: [],
        nextEvent: 'Rate increase announcement today'
      },
      5: {
        title: 'Rate Increase Day',
        description: 'Rate increase notification and updated calculations',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D',
        notes: 'Foundation work - rate increase effective today',
        events: ['Rate increased from $72.50 to $78.00/hour'],
        nextEvent: 'New project location assignment'
      },
      6: {
        title: 'Standard Day',
        description: 'Regular shift with new rate',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D',
        notes: 'Foundation work - north section',
        events: [],
        nextEvent: 'Equipment upgrade scheduled'
      },
      7: {
        title: 'Standard Day',
        description: 'Regular shift with new rate',
        hours: 8,
        location: 'Calgary Downtown Tower - Site A',
        equipment: 'Excavator 320D',
        notes: 'Foundation work - south section',
        events: [],
        nextEvent: 'Location change notification'
      },
      8: {
        title: 'Location Change Day',
        description: 'Client requests move to new site location',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 320D + Transport Equipment',
        notes: 'Site relocation - new foundation work at industrial park',
        events: ['Location changed to Industrial Park', 'Transport costs added'],
        nextEvent: 'New equipment delivery'
      },
      9: {
        title: 'New Equipment Day',
        description: 'New equipment delivery and setup',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D (New) + Setup Tools',
        notes: 'New equipment setup and testing',
        events: ['New excavator delivered', 'Equipment training completed'],
        nextEvent: 'Weekend emergency work possibility'
      },
      10: {
        title: 'Standard Production Day',
        description: 'Normal production with new equipment',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D',
        notes: 'Foundation work - main building',
        events: [],
        nextEvent: 'Weekend emergency notification'
      },
      11: {
        title: 'Standard Day',
        description: 'Regular shift with new equipment',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D',
        notes: 'Foundation work - secondary building',
        events: [],
        nextEvent: 'Emergency weekend work'
      },
      12: {
        title: 'Weekend Emergency Work',
        description: 'Emergency weekend work due to client deadline',
        hours: 6,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D + Emergency Equipment',
        notes: 'Emergency weekend work - deadline pressure',
        events: ['Weekend emergency work', 'Overtime rates applied', 'Deadline pressure'],
        nextEvent: 'Project completion celebration'
      },
      13: {
        title: 'Standard Day',
        description: 'Regular shift after emergency work',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D',
        notes: 'Foundation work - final sections',
        events: [],
        nextEvent: 'Project completion'
      },
      14: {
        title: 'Standard Day',
        description: 'Regular shift approaching project end',
        hours: 8,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D',
        notes: 'Foundation work - finishing touches',
        events: [],
        nextEvent: 'Final day of project'
      },
      15: {
        title: 'Project Completion Day',
        description: 'Final day of the project with completion celebration',
        hours: 6,
        location: 'Calgary Industrial Park - Site B',
        equipment: 'Excavator 350D + Cleanup Equipment',
        notes: 'Project completion - final cleanup and handover',
        events: ['Project completed successfully', 'Client handover', 'Bonus payment'],
        nextEvent: 'New project assignment'
      }
    };
    
    return scenarios[simulationDay as keyof typeof scenarios] || scenarios[1];
  };

  const currentScenario = getSimulationScenario();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mock location
    setTimeout(() => {
      setCurrentLocation('Calgary Downtown Tower - Site A');
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-CA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (start: Date, end: Date = new Date()) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getCurrentWorkDuration = () => {
    if (!startTime) return '00:00';
    const totalTime = currentTime.getTime() - startTime.getTime() - totalBreakTime;
    const hours = Math.floor(totalTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getCurrentBreakDuration = () => {
    if (!breakStartTime) return '00:00';
    return formatDuration(breakStartTime, currentTime);
  };

  const startWork = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setTotalBreakTime(0);
  };

  const endWork = () => {
    if (isOnBreak) {
      // End break first
      endBreak();
    }
    
    setIsTracking(false);
    setIsOnBreak(false);
    
    // Create new entry
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: startTime?.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }) || '',
      endTime: currentTime.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
      location: {
        lat: 51.0447,
        lng: -114.0719,
        address: currentLocation
      },
      equipment,
      photos,
      notes,
      status: 'completed'
    };
    
    setTodaysEntries(prev => [...prev, newEntry]);
    setStartTime(null);
    setEquipment('');
    setNotes('');
    setPhotos([]);
  };

  const startBreak = () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
  };

  const endBreak = () => {
    if (breakStartTime) {
      const breakDuration = currentTime.getTime() - breakStartTime.getTime();
      setTotalBreakTime(prev => prev + breakDuration);
    }
    setIsOnBreak(false);
    setBreakStartTime(null);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In real app, would upload to server and get URLs
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const getTotalHoursToday = () => {
    let total = 0;
    todaysEntries.forEach(entry => {
      if (entry.startTime && entry.endTime) {
        const start = new Date(`2024-01-01 ${entry.startTime}`);
        const end = new Date(`2024-01-01 ${entry.endTime}`);
        total += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
    });
    
    // Add current session if tracking
    if (isTracking && startTime) {
      const currentSession = (currentTime.getTime() - startTime.getTime() - totalBreakTime) / (1000 * 60 * 60);
      total += currentSession;
    }
    
    return total.toFixed(1);
  };

  const simulateWorkDay = () => {
    if (!isSimulationMode || !currentScenario) return;
    
    // Auto-fill realistic data based on scenario
    setEquipment(currentScenario.equipment);
    setNotes(currentScenario.notes);
    setCurrentLocation(currentScenario.location);
    
    // Simulate a completed work day
    const simulatedStartTime = new Date();
    simulatedStartTime.setHours(7, 30, 0, 0); // 7:30 AM start
    
    const simulatedEndTime = new Date();
    simulatedEndTime.setHours(7 + currentScenario.hours, 30, 0, 0); // End based on scenario hours
    
    const simulatedEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: simulatedStartTime.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
      endTime: simulatedEndTime.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
      location: {
        lat: 51.0447,
        lng: -114.0719,
        address: currentScenario.location
      },
      equipment: currentScenario.equipment,
      photos: [],
      notes: currentScenario.notes,
      status: 'completed'
    };
    
    setTodaysEntries(prev => [...prev, simulatedEntry]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Scenario Overlay */}
      {isSimulationMode && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Day {simulationDay} Scenario</h3>
                <p className="text-sm text-blue-600">{currentScenario.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Demo Mode</span>
            </div>
          </div>
          
          {/* Scenario Description */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-2">Today's Scenario</h4>
                <p className="text-sm text-blue-700 mb-3">{currentScenario.description}</p>
                
                {/* Scenario Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Hours:</span>
                    <span className="text-blue-700 ml-2">{currentScenario.hours}h</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Location:</span>
                    <span className="text-blue-700 ml-2">{currentScenario.location}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Equipment:</span>
                    <span className="text-blue-700 ml-2">{currentScenario.equipment}</span>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Rate:</span>
                    <span className="text-blue-700 ml-2">
                      {simulationDay >= 5 ? '$78.00' : '$72.50'}/hour
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Events */}
          {currentScenario.events.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-2">Today's Events</h4>
                  <ul className="space-y-1">
                    {currentScenario.events.map((event, index) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-center space-x-2">
                        <Zap className="w-3 h-3" />
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* What Would Happen Next */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-2">What Would Happen Next</h4>
                <p className="text-sm text-green-700">{currentScenario.nextEvent}</p>
              </div>
            </div>
          </div>

          {/* Simulate Work Day Button */}
          <motion.button
            onClick={simulateWorkDay}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <Play className="w-5 h-5" />
            <span>Simulate Work Day</span>
          </motion.button>
        </div>
      )}

      {/* Main Timer Display */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold text-gray-900 mb-2">
            {isTracking ? getCurrentWorkDuration() : '00:00'}
          </div>
          <p className="text-lg text-gray-600">
            {isTracking ? (isOnBreak ? 'On Break' : 'Working') : 'Not Started'}
          </p>
          {isOnBreak && (
            <p className="text-sm text-orange-600">
              Break: {getCurrentBreakDuration()}
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {!isTracking ? (
            <button
              onClick={startWork}
              className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium transition-colors ${
                isSimulationMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Play className="w-5 h-5" />
              <span>{isSimulationMode ? 'Start Demo Work Day' : 'Start Work Day'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {!isOnBreak ? (
                <button
                  onClick={startBreak}
                  className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>Start Break</span>
                </button>
              ) : (
                <button
                  onClick={endBreak}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>End Break</span>
                </button>
              )}
              
              <button
                onClick={endWork}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>End Work</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current Session Details */}
      {isTracking && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isSimulationMode ? 'Demo Session' : 'Current Session'}
          </h3>
          
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{currentLocation}</p>
                <p className="text-xs text-gray-500">Started: {startTime?.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* Equipment */}
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment/Vehicle
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder={isSimulationMode ? currentScenario?.equipment : "e.g., Excavator 320D, Truck #45"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Work Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isSimulationMode ? currentScenario?.notes : "Describe the work being performed..."}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Work Photos
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Add Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photos.length > 0 && (
                  <span className="text-sm text-gray-600">{photos.length} photo(s) added</span>
                )}
              </div>
              
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Work photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isSimulationMode ? 'Demo Summary' : 'Today\'s Summary'}
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{getTotalHoursToday()}h</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{todaysEntries.length + (isTracking ? 1 : 0)}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${isSimulationMode && simulationDay >= 5 ? 
                (parseFloat(getTotalHoursToday()) * 78).toFixed(0) : 
                (parseFloat(getTotalHoursToday()) * 72.5).toFixed(0)
              }
            </div>
            <div className="text-sm text-gray-600">Estimated Pay</div>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="space-y-3">
          {todaysEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {entry.startTime} - {entry.endTime}
                  </p>
                  <p className="text-sm text-gray-600">{entry.location.address}</p>
                  {entry.equipment && (
                    <p className="text-xs text-gray-500">{entry.equipment}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {entry.startTime && entry.endTime ? 
                    formatDuration(
                      new Date(`2024-01-01 ${entry.startTime}`),
                      new Date(`2024-01-01 ${entry.endTime}`)
                    ) : 
                    'In Progress'
                  }
                </p>
              </div>
            </div>
          ))}
          
          {isTracking && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-emerald-600 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium text-emerald-900">
                    {startTime?.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })} - Active
                  </p>
                  <p className="text-sm text-emerald-700">{currentLocation}</p>
                  {equipment && (
                    <p className="text-xs text-emerald-600">{equipment}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-900">{getCurrentWorkDuration()}</p>
                {isOnBreak && (
                  <p className="text-xs text-orange-600">Break: {getCurrentBreakDuration()}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingWidget; 