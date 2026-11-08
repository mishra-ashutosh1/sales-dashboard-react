export default function DatasetSummary({ data }) {
  const { salesColumns, inventoryColumns, feedbackColumns, dataQuality } = data;

  return (
    <div className="card span-12">
      <h3>Dataset structure</h3>
      <div className="note">
        <p>
          <strong>Sales columns:</strong> {salesColumns.join(', ')}
        </p>
        <p>
          <strong>Inventory columns:</strong> {inventoryColumns.join(', ')}
        </p>
        <p>
          <strong>Feedback columns:</strong> {feedbackColumns.join(', ')}
        </p>
        <p>
          <strong>Rows:</strong> Sales {dataQuality.salesRows}, Inventory{' '}
          {dataQuality.inventoryRows}, Feedback {dataQuality.feedbackRows}
        </p>
        <p>
          <strong>Missing cells:</strong> Sales {dataQuality.salesMissingCells},{' '}
          Inventory {dataQuality.inventoryMissingCells}, Feedback{' '}
          {dataQuality.feedbackMissingCells}
        </p>
      </div>
    </div>
  );
}
