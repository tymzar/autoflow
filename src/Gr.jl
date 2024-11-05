
module Gr
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/gr.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "gr",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-Gr.js",
    external_url = "https://unpkg.com/gr@0.0.1/gr/async-Gr.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-Gr.js.map",
    external_url = "https://unpkg.com/gr@0.0.1/gr/async-Gr.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "gr.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "gr.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
