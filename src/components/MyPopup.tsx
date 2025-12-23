import {
  X,
  Phone,
  User,
  Mail,
  MessageCircle,
  Github,
  Linkedin,
  Globe,
  Clock,
} from "lucide-react";

interface DeveloperDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  mobile?: string;
  email?: string;
  whatsapp?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  availability?: string;
  timezone?: string;
}

const DeveloperDetailsModal: React.FC<DeveloperDetailsModalProps> = ({
  isOpen,
  onClose,
  name="Aloukik Omar",
  mobile="7703940948",
  email="omar.aloukik@gmail.com",
  whatsapp="7703940948",
  github="https://github.com/aloukikomar",
  linkedin="",
  website="",
  availability="Mon–Sat · 10am–7pm",
  timezone="IST (GMT +5:30)"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-[92%] max-w-md rounded-2xl shadow-xl p-6 z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            Developer Contact
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">

          {/* NAME */}
          <Item icon={<User />} label="Name" value={name} />

          {/* MOBILE */}
          <Item
            icon={<Phone />}
            label="Mobile"
            value={
              <a href={`tel:${mobile}`} className="hover:text-primary">
                {mobile}
              </a>
            }
          />

          {/* WHATSAPP */}
          {whatsapp && (
            <Item
              icon={<MessageCircle />}
              label="WhatsApp"
              value={
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Chat on WhatsApp
                </a>
              }
            />
          )}

          {/* EMAIL */}
          <Item
            icon={<Mail />}
            label="Email"
            value={
              <a href={`mailto:${email}`} className="hover:text-primary">
                {email}
              </a>
            }
          />

          {/* LINKEDIN */}
          {linkedin && (
            <Item
              icon={<Linkedin />}
              label="LinkedIn"
              value={
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              }
            />
          )}

          {/* GITHUB */}
          {github && (
            <Item
              icon={<Github />}
              label="GitHub"
              value={
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  github.com
                </a>
              }
            />
          )}

          {/* WEBSITE */}
          {website && (
            <Item
              icon={<Globe />}
              label="Website"
              value={
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {website}
                </a>
              }
            />
          )}

          {/* AVAILABILITY */}
          {availability && (
            <Item icon={<Clock />} label="Availability" value={availability} />
          )}

          {/* TIMEZONE */}
          {timezone && (
            <Item icon={<Clock />} label="Timezone" value={timezone} />
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-primary font-medium hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Item = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default DeveloperDetailsModal;
