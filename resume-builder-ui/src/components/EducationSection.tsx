import IconManager from "./IconManager";

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  field_of_study?: string;
  icon?: string | null;
  iconFile?: File | null;
  iconBase64?: string | null;
}

// Icon registry methods passed from parent Editor component
interface IconRegistryMethods {
  registerIcon: (file: File) => string;
  getIconFile: (filename: string) => File | null;
  removeIcon: (filename: string) => void;
}

interface EducationSectionProps {
  education: EducationItem[];
  onUpdate: (updatedEducation: EducationItem[]) => void;
  supportsIcons?: boolean;
  iconRegistry?: IconRegistryMethods;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onUpdate,
  supportsIcons = false,
  iconRegistry,
}) => {
  const handleUpdateItem = (
    index: number,
    key: keyof EducationItem,
    value: string | File | null
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [key]: value };
    onUpdate(updatedEducation);
  };

  const handleAddItem = () => {
    const newEducation: EducationItem = {
      degree: "",
      school: "",
      year: "",
      field_of_study: "",
      icon: null,
      iconFile: null,
      iconBase64: null,
    };
    onUpdate([...education, newEducation]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    onUpdate(updatedEducation);
  };

  // Handle icon changes from IconManager
  const handleIconChange = (index: number, filename: string | null, file: File | null) => {
    // Single atomic update - IconManager handles file storage
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      icon: filename,
      iconFile: file, // Keep for transition compatibility
      iconBase64: null, // Clear any old base64 data
    };
    onUpdate(updatedEducation);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
      </div>
      {education.map((item, index) => (
        <div
          key={index}
          className="bg-gray-50/80 backdrop-blur-sm p-6 mb-6 rounded-xl border border-gray-200 shadow-md"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Entry {index + 1}</h3>
            <button
              onClick={() => handleRemoveItem(index)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          <div className="mt-4">
            {/* Icon Manager Section */}
            {supportsIcons && iconRegistry && (
              <div className="mb-4">
                <IconManager
                  value={item.icon || null}
                  onChange={(filename, file) => handleIconChange(index, filename, file)}
                  registerIcon={iconRegistry.registerIcon}
                  getIconFile={iconRegistry.getIconFile}
                  removeIcon={iconRegistry.removeIcon}
                />
              </div>
            )}
            {/* Other Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) =>
                    handleUpdateItem(index, "degree", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={item.school}
                  onChange={(e) =>
                    handleUpdateItem(index, "school", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) =>
                    handleUpdateItem(index, "year", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={item.field_of_study || ""}
                  onChange={(e) =>
                    handleUpdateItem(index, "field_of_study", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddItem}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mt-4"
      >
        Add Entry
      </button>
    </div>
  );
};

export default EducationSection;
