import { useRef, useState } from "react";
import { themes, useTheme } from "../context/ThemeContext";

export default function ThemeStudio() {
  const { theme, setTheme, resetTheme } = useTheme();
  const fileInput = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const activePalette = themes[theme.preset] || themes.Indigo;
  const buttonColor = theme.buttonColor || activePalette.accent;

  function uploadFont(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");
    setError("");
    if (!/\.(ttf|otf|woff|woff2)$/i.test(file.name)) {
      setError("Choose a .ttf, .otf, .woff, or .woff2 font file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("The font file must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setTheme((current) => ({
        ...current,
        fontName: file.name,
        fontData: String(reader.result),
      }));
      setMessage("Font loaded. Your preference is saved in this browser.");
    };
    reader.onerror = () => setError("The selected font could not be read.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function reset() {
    resetTheme();
    setMessage("Theme reset to the default preset.");
    setError("");
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Custom theming engine</h1>
          <p className="page-description">
            Choose a palette, override button color, and upload your own font.
            Changes apply instantly across the app.
          </p>
        </div>
        <button className="button button-secondary" onClick={reset}>
          Reset theme
        </button>
      </div>
      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
      <section className="panel theme-panel">
        <div className="panel-heading">
          <div>
            <h2>Color presets</h2>
            <p>
              Each preset defines the app background, surface, text, borders,
              and accent.
            </p>
          </div>
        </div>
        <div className="theme-presets">
          {Object.entries(themes).map(([name, palette]) => (
            <button
              type="button"
              key={name}
              className={`theme-preset${theme.preset === name ? " selected" : ""}`}
              onClick={() =>
                setTheme((current) => ({ ...current, preset: name }))
              }
              aria-pressed={theme.preset === name}
            >
              <span className="swatch-row">
                <i style={{ background: palette.bg }} />
                <i
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                  }}
                />
                <i style={{ background: palette.accent }} />
              </span>
              <span className="preset-name">{name}</span>
              <span className="preset-description">
                {name === "Indigo"
                  ? "Clear and balanced"
                  : name === "Ocean"
                    ? "Cool and focused"
                    : name === "Forest"
                      ? "Natural and calm"
                      : "Warm and energetic"}
              </span>
              {theme.preset === name && (
                <span className="preset-check">✓ Selected</span>
              )}
            </button>
          ))}
        </div>
      </section>
      <div className="theme-settings-grid">
        <section className="panel setting-panel">
          <div className="panel-heading">
            <div>
              <h2>Custom button color</h2>
              <p>
                Overrides only the accent/button color, independently of the
                selected preset.
              </p>
            </div>
          </div>
          <div className="color-picker-row">
            <input
              type="color"
              value={buttonColor}
              onChange={(event) =>
                setTheme((current) => ({
                  ...current,
                  buttonColor: event.target.value,
                }))
              }
              aria-label="Choose custom button color"
            />
            <code>{buttonColor.toUpperCase()}</code>
            <button
              className="button button-secondary"
              onClick={() =>
                setTheme((current) => ({ ...current, buttonColor: "" }))
              }
            >
              Use preset color
            </button>
          </div>
          <div className="preview-card">
            <div>
              <span className="preview-label">LIVE PREVIEW</span>
              <h3>Team workspace</h3>
              <p>This sample uses your current theme.</p>
            </div>
            <button className="button button-primary" type="button">
              Preview button
            </button>
          </div>
        </section>
        <section className="panel setting-panel">
          <div className="panel-heading">
            <div>
              <h2>Custom font upload</h2>
              <p>Upload a TTF, OTF, WOFF, or WOFF2 file, up to 2 MB.</p>
            </div>
          </div>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={uploadFont}
          />
          <button
            className="font-upload"
            type="button"
            onClick={() => fileInput.current?.click()}
          >
            <span className="upload-icon">↑</span>
            <span>
              <strong>{theme.fontName || "Choose font file"}</strong>
              <small>Click to browse your files</small>
            </span>
          </button>
          {theme.fontName && (
            <div className="font-current">
              <span>✓ Applied: {theme.fontName}</span>
              <button
                className="text-button danger-text"
                onClick={() => {
                  setTheme((current) => ({
                    ...current,
                    fontName: "",
                    fontData: "",
                  }));
                  setMessage("Custom font removed.");
                }}
              >
                Remove font
              </button>
            </div>
          )}
          <div className="font-sample">
            <span className="preview-label">TYPE PREVIEW</span>
            <p>The quick brown fox jumps over the lazy dog.</p>
            <small>0123456789 · Dashboard · User management</small>
          </div>
        </section>
      </div>
      
    </>
  );
}
