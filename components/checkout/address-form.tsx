"use client";

export type AddressFormData = {
  street: string;
  neighborhood: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement: string;
};

const emptyForm: AddressFormData = {
  street: "",
  neighborhood: "",
  number: "",
  city: "",
  state: "",
  country: "",
  complement: "",
};

type AddressFormProps = {
  data: AddressFormData;
  onChange: (data: AddressFormData) => void;
  errors?: Partial<Record<keyof AddressFormData, string>>;
};

export function AddressForm({
  data,
  onChange,
  errors = {},
}: AddressFormProps) {
  const update = (key: keyof AddressFormData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
  const errorClass = "mt-1 text-xs text-destructive";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium">Street *</label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => update("street", e.target.value)}
          className={inputClass}
          placeholder="Street name"
          maxLength={100}
        />
        {errors.street && <p className={errorClass}>{errors.street}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Number</label>
        <input
          type="text"
          inputMode="numeric"
          value={data.number}
          onChange={(e) =>
            update("number", e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className={inputClass}
          placeholder="123"
          maxLength={6}
        />
        {errors.number && <p className={errorClass}>{errors.number}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Complement</label>
        <input
          type="text"
          value={data.complement}
          onChange={(e) => update("complement", e.target.value)}
          className={inputClass}
          placeholder="Apt, suite..."
          maxLength={100}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium">Neighborhood *</label>
        <input
          type="text"
          value={data.neighborhood}
          onChange={(e) => update("neighborhood", e.target.value)}
          className={inputClass}
          placeholder="Neighborhood / district"
          maxLength={100}
        />
        {errors.neighborhood && (
          <p className={errorClass}>{errors.neighborhood}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">City *</label>
        <input
          type="text"
          value={data.city}
          onChange={(e) => update("city", e.target.value)}
          className={inputClass}
          placeholder="City"
          maxLength={100}
        />
        {errors.city && <p className={errorClass}>{errors.city}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">State *</label>
        <input
          type="text"
          value={data.state}
          onChange={(e) =>
            update("state", e.target.value.toUpperCase().slice(0, 2))
          }
          className={inputClass}
          placeholder="XX"
          maxLength={2}
        />
        {errors.state && <p className={errorClass}>{errors.state}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium">Country *</label>
        <input
          type="text"
          value={data.country}
          onChange={(e) =>
            update("country", e.target.value.toUpperCase().slice(0, 2))
          }
          className={inputClass}
          placeholder="XX"
          maxLength={2}
        />
        {errors.country && <p className={errorClass}>{errors.country}</p>}
      </div>
    </div>
  );
}

export { emptyForm };
